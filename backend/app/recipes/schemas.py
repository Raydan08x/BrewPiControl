"""Esquemas Pydantic para Recetas."""
from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional

class RecipeBase(BaseModel):
    name: str = Field(..., max_length=120)
    style: Optional[str] = None
    batch_size_l: Optional[float] = None
    efficiency: Optional[float] = None
    og: Optional[float] = None
    fg: Optional[float] = None
    abv: Optional[float] = None
    ibu: Optional[float] = None
    color_srm: Optional[float] = None
    notes: Optional[str] = None

    class Config:
        orm_mode = True  # Compatibilidad Pydantic v1, se migrará a from_attributes

class RecipeCreate(RecipeBase):
    pass

class RecipeUpdate(RecipeBase):
    pass

class RecipeDTO(RecipeBase):
    id: int
    created_at: datetime
