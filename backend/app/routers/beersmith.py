from fastapi import APIRouter
from app.beersmith.importer import scan_beersmith_db

router = APIRouter(prefix="/api/beersmith", tags=["BeerSmith"])

@router.get("/summary", summary="Resumen de archivos BeerSmith")
def beersmith_summary():
    """Devuelve un resumen de los archivos BeerSmith (.bsmx) encontrados y sus contenidos."""
    return scan_beersmith_db()
