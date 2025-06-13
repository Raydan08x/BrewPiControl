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


@router.post("/import", status_code=202)
async def import_bulk(file: UploadFile = File(...)) -> dict[str, str]:  # noqa: D401
    # Placeholder: procesamiento se implementará en sprint 2.
    contents = await file.read()
    size_kb = len(contents) / 1024
    return {"msg": f"Archivo {file.filename} ({size_kb:.1f} KB) recibido. Procesamiento pendiente."}


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
