from pydantic import BaseModel
from typing import Optional

class ProviderDTO(BaseModel):
    id: int
    name: str
    contact: Optional[str]
    address: Optional[str]
    phone: Optional[str]
    email: Optional[str]
    notes: Optional[str]
    class Config:
        orm_mode = True
