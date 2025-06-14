"""Servicio CRUD para recetas."""
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.recipes.models import Recipe

async def list_recipes(db: AsyncSession):
    res = await db.execute(select(Recipe))
    return res.scalars().all()

async def get_recipe(db: AsyncSession, recipe_id: int):
    return await db.get(Recipe, recipe_id)

async def create_recipe(db: AsyncSession, data: dict):
    recipe = Recipe(**data)
    db.add(recipe)
    await db.commit()
    await db.refresh(recipe)
    return recipe

async def update_recipe(db: AsyncSession, recipe_id: int, data: dict):
    recipe = await db.get(Recipe, recipe_id)
    if not recipe:
        return None
    for k, v in data.items():
        setattr(recipe, k, v)
    await db.commit()
    await db.refresh(recipe)
    return recipe
