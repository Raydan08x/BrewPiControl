"""Servicio para gestión de proveedores."""
from app.providers.models import Provider
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

async def get_providers(db: AsyncSession, search: str = None):
    q = select(Provider)
    if search:
        q = q.where(Provider.name.ilike(f'%{search}%'))
    result = await db.execute(q)
    return result.scalars().all()

async def create_provider(db: AsyncSession, data: dict):
    provider = Provider(**data)
    db.add(provider)
    await db.commit()
    await db.refresh(provider)
    return provider

async def update_provider(db: AsyncSession, provider_id: int, data: dict):
    provider = await db.get(Provider, provider_id)
    if not provider:
        return None
    for k, v in data.items():
        setattr(provider, k, v)
    await db.commit()
    await db.refresh(provider)
    return provider

async def delete_provider(db: AsyncSession, provider_id: int):
    provider = await db.get(Provider, provider_id)
    if provider:
        await db.delete(provider)
        await db.commit()
    return provider
