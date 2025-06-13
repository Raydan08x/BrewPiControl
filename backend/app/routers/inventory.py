"""Router REST y WebSocket para Inventario."""
from __future__ import annotations

import asyncio
from decimal import Decimal
from typing import List

from fastapi import APIRouter, Depends, File, HTTPException, Path, UploadFile, WebSocket, WebSocketDisconnect
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.inventory.schemas import ItemCreate, ItemDTO, ItemUpdate, TransactionDTO
from app.inventory.service import inventory_service

router = APIRouter(prefix="/inventory", tags=["Inventory"])


# ---------------------- REST ----------------------


@router.get("/items", response_model=List[ItemDTO])
async def list_items(db: AsyncSession = Depends(get_db)) -> List[ItemDTO]:
    return await inventory_service.list_items(db)


@router.post("/items", response_model=ItemDTO, status_code=201)
async def create_item(data: ItemCreate, db: AsyncSession = Depends(get_db)) -> ItemDTO:
    return await inventory_service.create_item(db, data)


@router.patch("/items/{lot_number}", response_model=ItemDTO)
async def update_item(
    data: ItemUpdate,
    lot_number: str = Path(...),
    db: AsyncSession = Depends(get_db),
) -> ItemDTO:
    return await inventory_service.update_item(db, lot_number, data)


@router.delete("/items/{lot_number}", status_code=204)
async def delete_item(lot_number: str, db: AsyncSession = Depends(get_db)) -> None:  # noqa: D401
    await inventory_service.delete_item(db, lot_number)


@router.get("/items/{lot_number}/transactions", response_model=List[TransactionDTO])
async def item_transactions(lot_number: str, db: AsyncSession = Depends(get_db)) -> List[TransactionDTO]:
    txs = await inventory_service.get_transactions(db, lot_number)
    if txs is None:
        raise HTTPException(status_code=404, detail="Lot not found")
    return txs


@router.post("/import", status_code=201)
async def import_bulk(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
) -> dict[str, str]:  # noqa: D401
    """Importación masiva de inventario.

    El archivo debe contener columnas mínimas definidas en importer.REQUIRED_COLUMNS.
    Devuelve resumen de filas insertadas y errores ignorados.
    """

    contents = await file.read()
    from app.inventory.importer import ImportErrorReport, parse_upload  # local para evitar ciclo

    try:
        rows = await parse_upload(file.filename, contents)
    except ImportErrorReport as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    inserted = 0
    skipped: list[str] = []
    for row in rows:
        try:
            await inventory_service.create_item(db, ItemCreate(**row))
            inserted += 1
        except Exception as err:  # pylint: disable=broad-except
            skipped.append(f"{row.get('lot_number')}: {err}")
    return {"inserted": inserted, "skipped": skipped}


# ---------------------- WebSocket ----------------------


@router.websocket("/ws/inventory")
async def ws_inventory(ws: WebSocket) -> None:  # noqa: D401
    await ws.accept()
    queue = await inventory_service.register_ws()
    try:
        while True:
            msg = await queue.get()
            await ws.send_json(msg)
    except WebSocketDisconnect:
        pass
