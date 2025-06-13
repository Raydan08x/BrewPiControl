"""Modelos ORM para módulo de Inventario."""
from __future__ import annotations

import datetime as dt

from sqlalchemy import CheckConstraint, Column, Date, DateTime, Enum, ForeignKey, Numeric, String, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

CATEGORY_ENUM = (
    "malt",
    "hop",
    "yeast",
    "additive",
    "package",
    "consumable",
)

EVENT_ENUM = (
    "ALTA",
    "AJUSTE",
    "CONSUMO",
    "DEVOLUCION",
    "IMPORT",
)


class InventoryItem(Base):
    __tablename__ = "inventory_items"

    lot_number: str = Column(String, primary_key=True, index=True)
    name: str = Column(String, nullable=False)
    category: str = Column(Enum(*CATEGORY_ENUM, name="inventory_category_enum"), nullable=False)
    quantity_available = Column(Numeric(12, 3), nullable=False, default=0)
    unit: str = Column(String, nullable=False)
    supplier: str | None = Column(String, nullable=True)
    cost = Column(Numeric(12, 2), nullable=True)
    expiry_date: dt.date | None = Column(Date)
    location: str | None = Column(String)
    created_at: dt.datetime = Column(DateTime(timezone=True), default=dt.datetime.utcnow)

    transactions = relationship(
        "InventoryTransaction", back_populates="item", cascade="all,delete", lazy="selectin"
    )

    __table_args__ = (
        CheckConstraint("quantity_available >= 0", name="ck_inventory_items_qty_nonnegative"),
    )


class InventoryTransaction(Base):
    __tablename__ = "inventory_transactions"

    id = Column(Numeric(18, 0), primary_key=True, autoincrement=True)
    lot_number: str = Column(String, ForeignKey("inventory_items.lot_number", ondelete="CASCADE"))
    event_type: str = Column(Enum(*EVENT_ENUM, name="inventory_event_enum"), nullable=False)
    quantity_delta = Column(Numeric(12, 3), nullable=False)
    batch_id: str | None = Column(String)
    user: str | None = Column(String)
    timestamp: dt.datetime = Column(DateTime(timezone=True), default=dt.datetime.utcnow, index=True)

    item = relationship("InventoryItem", back_populates="transactions")
