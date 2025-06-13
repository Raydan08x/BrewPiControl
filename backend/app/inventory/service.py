"""Servicio de Inventario con lógica de negocio."""
from __future__ import annotations

import asyncio
from decimal import Decimal
from typing import List

from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession

from app.inventory.models import InventoryItem, InventoryTransaction
from app.inventory.schemas import ItemCreate, ItemUpdate


class InventoryService:  # pylint: disable=too-few-public-methods
    def __init__(self) -> None:
        self._listeners: list[asyncio.Queue] = []

    # ------------------ CRUD Items ------------------
    async def list_items(self, db: AsyncSession) -> List[InventoryItem]:
        res = await db.execute(select(InventoryItem))
        return res.scalars().all()

    async def create_item(self, db: AsyncSession, data: ItemCreate) -> InventoryItem:
        item = InventoryItem(**data.dict())
        db.add(item)
        db.add(
            InventoryTransaction(
                lot_number=item.lot_number, event_type="ALTA", quantity_delta=data.quantity_available
            )
        )
        await db.commit()
        await db.refresh(item)
        await self._broadcast({"event": "ALTA", "lot_number": item.lot_number})
        return item

    async def update_item(self, db: AsyncSession, lot_number: str, data: ItemUpdate) -> InventoryItem:
        stmt = (
            update(InventoryItem)
            .where(InventoryItem.lot_number == lot_number)
            .values(**{k: v for k, v in data.dict(exclude_unset=True).items()})
            .returning(InventoryItem)
        )
        res = await db.execute(stmt)
        item = res.scalar_one()
        await db.commit()
        await self._broadcast({"event": "UPDATE", "lot_number": lot_number})
        return item

    async def delete_item(self, db: AsyncSession, lot_number: str) -> None:
        await db.execute(delete(InventoryItem).where(InventoryItem.lot_number == lot_number))
        await db.commit()
        await self._broadcast({"event": "DELETE", "lot_number": lot_number})

    # ------------------ Transacciones ------------------
    async def get_transactions(self, db: AsyncSession, lot_number: str):
        res = await db.execute(
            select(InventoryTransaction).where(InventoryTransaction.lot_number == lot_number).order_by(
                InventoryTransaction.timestamp.desc()
            )
        )
        return res.scalars().all()

    async def consume(self, db: AsyncSession, lot_number: str, qty: Decimal, batch_id: str | None = None):
        item = await db.get(InventoryItem, lot_number)
        if not item:
            raise ValueError("Item not found")
        if item.quantity_available - qty < 0:
            raise ValueError("Saldo negativo no permitido")
        item.quantity_available -= qty
        db.add(
            InventoryTransaction(
                lot_number=lot_number, event_type="CONSUMO", quantity_delta=-qty, batch_id=batch_id
            )
        )
        await db.commit()
        await self._broadcast({"event": "CONSUMO", "lot_number": lot_number, "delta": str(-qty)})

    # ------------------ WS broadcast ------------------
    async def register_ws(self) -> asyncio.Queue:
        q: asyncio.Queue = asyncio.Queue()
        self._listeners.append(q)
        return q

    async def _broadcast(self, msg: dict) -> None:
        for q in self._listeners:
            await q.put(msg)


inventory_service = InventoryService()
