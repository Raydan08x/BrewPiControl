"""Model ORM para recetas de elaboración"""
from datetime import datetime

from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    style = Column(String(80), nullable=True)
    batch_size_l = Column(Float, nullable=True)
    efficiency = Column(Float, nullable=True)
    og = Column(Float, nullable=True)
    fg = Column(Float, nullable=True)
    abv = Column(Float, nullable=True)
    ibu = Column(Float, nullable=True)
    color_srm = Column(Float, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
