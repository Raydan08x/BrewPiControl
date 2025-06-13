from .status import router as status_router
from .fermentation import router as fermentation_router
from .inventory import router as inventory_router

routers = [status_router, fermentation_router, inventory_router]