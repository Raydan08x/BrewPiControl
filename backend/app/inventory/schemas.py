"""Esquemas Pydantic para Inventario."""
from __future__ import annotations

import datetime as dt
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, Field, validator

CATEGORY_OPTIONS = [
    "malt",
    "hop",
    "yeast",
    "additive",
    "package",
    "consumable",
]


class ItemBase(BaseModel):
    name: str = Field(..., max_length=120)
    category: str = Field(..., regex="|".join(CATEGORY_OPTIONS))
    unit: str = Field(..., max_length=16)
    supplier: Optional[str] = None
    cost: Optional[Decimal] = None
    expiry_date: Optional[dt.date] = None
    location: Optional[str] = None


class ItemCreate(ItemBase):
    lot_number: str = Field(..., max_length=64)
    quantity_available: Decimal = Field(..., ge=0)


class ItemUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    quantity_available: Optional[Decimal] = Field(None, ge=0)
    unit: Optional[str] = None
    supplier: Optional[str] = None
    cost: Optional[Decimal] = None
    expiry_date: Optional[dt.date] = None
    location: Optional[str] = None


class ItemDTO(ItemBase):
    lot_number: str
    quantity_available: Decimal
    created_at: dt.datetime

    class Config:  # noqa: D401
        orm_mode = True


class TransactionDTO(BaseModel):
    id: int
    event_type: str
    quantity_delta: Decimal
    batch_id: Optional[str]
    user: Optional[str]
    timestamp: dt.datetime

    class Config:  # noqa: D401
        orm_mode = True
