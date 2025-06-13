"""Modelos ORM para catálogo base de ingredientes."""
from __future__ import annotations

import datetime as dt
from sqlalchemy import Column, Integer, String, Enum, Numeric, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

INGREDIENT_TYPE_ENUM = (
    "malt",
    "hop",
    "yeast",
    "misc",
    "salt",
    "other",
)

class IngredientBase(Base):
    __tablename__ = "ingredient_base"

    id = Column(Integer, primary_key=True, autoincrement=True)
    type = Column(Enum(*INGREDIENT_TYPE_ENUM, name="ingredient_type_enum"), nullable=False)
    name = Column(String, nullable=False, index=True)
    manufacturer = Column(String, nullable=True)
    origin = Column(String, nullable=True)
    ebc = Column(Numeric(6, 2), nullable=True)         # Maltas
    lovibond = Column(Numeric(6, 2), nullable=True)    # Maltas
    yield_percent = Column(Numeric(5, 2), nullable=True) # Maltas
    moisture = Column(Numeric(5, 2), nullable=True)    # Maltas
    diastatic_power = Column(Numeric(5, 2), nullable=True) # Maltas
    aa_percent = Column(Numeric(5, 2), nullable=True)  # Lúpulos
    form = Column(String, nullable=True)               # Lúpulos/Levaduras
    min_temp = Column(Numeric(5, 2), nullable=True)    # Levaduras
    max_temp = Column(Numeric(5, 2), nullable=True)    # Levaduras
    attenuation = Column(Numeric(5, 2), nullable=True) # Levaduras
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=dt.datetime.utcnow)
