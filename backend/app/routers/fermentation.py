"""Rutas REST del subsistema de fermentación."""
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Path
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.fermentation import FermentationReading, FermentationTank
from app.services.fermentation_service import fermentation_service
from pydantic import BaseModel, Field
from typing import List

router = APIRouter(prefix="/fermentation", tags=["Fermentation"])


class TankDTO(BaseModel):
    id: str
    name: str
    profile: str | None = None

    class Config:  # noqa: D401
        orm_mode = True


class ProfileAssignment(BaseModel):
    profile_name: str = Field(..., description="Nombre del perfil de fermentación")


class ReadingDTO(BaseModel):
    timestamp: str
    temperature: float
    pressure: float
    co2: float

    class Config:  # noqa: D401
        orm_mode = True


@router.get("/tanks", response_model=List[TankDTO], summary="Lista tanques de fermentación")
async def list_tanks(db: AsyncSession = Depends(get_db)) -> List[TankDTO]:
    """Devuelve todos los tanques de fermentación registrados en BD."""
    tanks = await fermentation_service.list_tanks(db)
    return tanks


@router.post(
    "/tanks/{tank_id}/profile",
    summary="Asignar perfil a tanque",
    status_code=200,
)
async def assign_profile(
    data: ProfileAssignment,
    tank_id: str = Path(..., description="ID de tanque"),
    db: AsyncSession = Depends(get_db),
) -> None:
    await fermentation_service.assign_profile(db, tank_id, data.profile_name)
    return {"detail": "Profile assigned"}


@router.get(
    "/tanks/{tank_id}/history",
    response_model=List[ReadingDTO],
    summary="Histórico de lecturas de un tanque",
)
async def get_history(
    tank_id: str = Path(..., description="ID de tanque"),
    db: AsyncSession = Depends(get_db),
) -> List[ReadingDTO]:
    history = await fermentation_service.get_history(db, tank_id)
    if history is None:
        raise HTTPException(status_code=404, detail="Tank not found")
    return history
