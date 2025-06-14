from .status import router as status_router
from .fermentation import router as fermentation_router
from .inventory import router as inventory_router
from .beersmith import router as beersmith_router
from app.providers.routers import router as providers_router
from app.recipes.routers import router as recipes_router

app_routers = [
    status_router,
    fermentation_router,
    inventory_router,
    beersmith_router,
    providers_router,
    recipes_router,
]

# Alias for backward compatibility
routers = app_routers