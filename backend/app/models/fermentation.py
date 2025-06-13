"""Modelos ORMs para el subsistema de fermentación."""
from __future__ import annotations

import datetime as dt
from typing import Optional

from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()


class FermentationTank(Base):
    """Tanque de fermentación."""

    __tablename__ = "fermentation_tanks"

    id: str = Column(String, primary_key=True, index=True)
    name: str = Column(String, nullable=False)
    profile: Optional[str] = Column(String, nullable=True)

    readings = relationship("FermentationReading", back_populates="tank", cascade="all,delete", lazy="selectin")


class FermentationReading(Base):
    """Lectura instantánea ligada a un tanque."""

    __tablename__ = "fermentation_readings"

    id: int = Column(Integer, primary_key=True, autoincrement=True)
    tank_id: str = Column(String, ForeignKey("fermentation_tanks.id"), index=True)
    timestamp: dt.datetime = Column(DateTime(timezone=True), default=dt.datetime.utcnow, index=True)

    temperature: float = Column(Float)
    pressure: float = Column(Float)
    co2: float = Column(Float)

    tank = relationship("FermentationTank", back_populates="readings")
