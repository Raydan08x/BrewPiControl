"""Router FastAPI para Recetas."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.recipes.schemas import RecipeDTO, RecipeCreate, RecipeUpdate
from app.recipes.service import list_recipes, create_recipe, get_recipe, update_recipe

router = APIRouter(prefix="/recipes", tags=["Recipes"])

@router.get("/", response_model=list[RecipeDTO])
async def get_recipes(db: AsyncSession = Depends(get_db)):
    return await list_recipes(db)

@router.post("/", response_model=RecipeDTO, status_code=status.HTTP_201_CREATED)
async def add_recipe(payload: RecipeCreate, db: AsyncSession = Depends(get_db)):
    return await create_recipe(db, payload.dict(exclude_unset=True))

@router.get("/{recipe_id}", response_model=RecipeDTO)
async def retrieve_recipe(recipe_id: int, db: AsyncSession = Depends(get_db)):
    recipe = await get_recipe(db, recipe_id)
    if not recipe:
        raise HTTPException(status_code=404, detail="Receta no encontrada")
    return recipe

@router.put("/{recipe_id}", response_model=RecipeDTO)
async def edit_recipe(recipe_id: int, payload: RecipeUpdate, db: AsyncSession = Depends(get_db)):
    recipe = await update_recipe(db, recipe_id, payload.dict(exclude_unset=True))
    if not recipe:
        raise HTTPException(status_code=404, detail="Receta no encontrada")
    return recipe
