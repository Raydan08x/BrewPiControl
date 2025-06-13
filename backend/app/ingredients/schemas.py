from pydantic import BaseModel
from typing import Optional

class IngredientBaseDTO(BaseModel):
    id: int
    type: str
    name: str
    manufacturer: Optional[str]
    origin: Optional[str]
    ebc: Optional[float]
    yield_percent: Optional[float]
    moisture: Optional[float]
    diastatic_power: Optional[float]
    aa_percent: Optional[float]
    form: Optional[str]
    min_temp: Optional[float]
    max_temp: Optional[float]
    attenuation: Optional[float]
    notes: Optional[str]

    class Config:
        orm_mode = True
