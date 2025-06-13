"""Router REST para gestión de proveedores."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.providers.schemas import ProviderDTO
from app.providers.service import get_providers, create_provider, update_provider, delete_provider

router = APIRouter(prefix="/providers", tags=["Providers"])

@router.get("/", response_model=list[ProviderDTO])
async def list_providers(search: str = None, db: AsyncSession = Depends(get_db)):
    return await get_providers(db, search)

@router.post("/", response_model=ProviderDTO, status_code=201)
async def add_provider(data: ProviderDTO, db: AsyncSession = Depends(get_db)):
    return await create_provider(db, data.dict(exclude_unset=True))

@router.patch("/{provider_id}", response_model=ProviderDTO)
async def edit_provider(provider_id: int, data: ProviderDTO, db: AsyncSession = Depends(get_db)):
    provider = await update_provider(db, provider_id, data.dict(exclude_unset=True))
    if not provider:
        raise HTTPException(status_code=404, detail="Proveedor no encontrado")
    return provider

@router.delete("/{provider_id}", status_code=204)
async def remove_provider(provider_id: int, db: AsyncSession = Depends(get_db)):
    provider = await delete_provider(db, provider_id)
    if not provider:
        raise HTTPException(status_code=404, detail="Proveedor no encontrado")
