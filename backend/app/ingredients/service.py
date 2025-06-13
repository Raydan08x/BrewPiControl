"""Servicio para poblar y consultar el catálogo base de ingredientes desde archivos .bsmx"""
import os
from lxml import etree as ET
from app.ingredients.models import IngredientBase, INGREDIENT_TYPE_ENUM
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

BEERSMITH_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../docs/DB_Beersmith3'))

def parse_grains_from_bsmx(filepath: str):
    parser = ET.XMLParser(recover=True, resolve_entities=True)
    tree = ET.parse(filepath, parser)
    root = tree.getroot()
    for grain in root.findall('.//Grain'):
        name = grain.findtext('NAME')
        manufacturer = grain.findtext('SUPPLIER')
        origin = grain.findtext('ORIGIN')
        ebc = grain.findtext('COLOR')
        yield_percent = grain.findtext('YIELD')
        moisture = grain.findtext('MOISTURE')
        diastatic_power = grain.findtext('DIASTATIC_POWER')
        notes = grain.findtext('NOTES')
        supplier = grain.findtext('SUPPLIER')  # Nuevo campo para proveedor
        yield {
            'type': 'malt',
            'name': name,
            'manufacturer': manufacturer,
            'origin': origin,
            'supplier': supplier,
            'ebc': float(ebc) if ebc else None,
            'yield_percent': float(yield_percent) if yield_percent else None,
            'moisture': float(moisture) if moisture else None,
            'diastatic_power': float(diastatic_power) if diastatic_power else None,
            'notes': notes,
        }

def parse_hops_from_bsmx(filepath: str):
    parser = ET.XMLParser(recover=True, resolve_entities=True)
    tree = ET.parse(filepath, parser)
    root = tree.getroot()
    for hop in root.findall('.//Hop'):
        name = hop.findtext('NAME')
        manufacturer = hop.findtext('SUPPLIER')
        origin = hop.findtext('ORIGIN')
        aa_percent = hop.findtext('ALPHA')
        form = hop.findtext('FORM')
        notes = hop.findtext('NOTES')
        yield {
            'type': 'hop',
            'name': name,
            'manufacturer': manufacturer,
            'origin': origin,
            'aa_percent': float(aa_percent) if aa_percent else None,
            'form': form,
            'notes': notes,
        }

def parse_yeasts_from_bsmx(filepath: str):
    parser = ET.XMLParser(recover=True, resolve_entities=True)
    tree = ET.parse(filepath, parser)
    root = tree.getroot()
    for yeast in root.findall('.//Yeast'):
        name = yeast.findtext('NAME')
        manufacturer = yeast.findtext('LAB')
        form = yeast.findtext('FORM')
        min_temp = yeast.findtext('MIN_TEMPERATURE')
        max_temp = yeast.findtext('MAX_TEMPERATURE')
        attenuation = yeast.findtext('ATTENUATION')
        notes = yeast.findtext('NOTES')
        yield {
            'type': 'yeast',
            'name': name,
            'manufacturer': manufacturer,
            'form': form,
            'min_temp': float(min_temp) if min_temp else None,
            'max_temp': float(max_temp) if max_temp else None,
            'attenuation': float(attenuation) if attenuation else None,
            'notes': notes,
        }

def parse_miscs_from_bsmx(filepath: str):
    parser = ET.XMLParser(recover=True, resolve_entities=True)
    tree = ET.parse(filepath, parser)
    root = tree.getroot()
    for misc in root.findall('.//Misc'):
        name = misc.findtext('NAME')
        type_misc = misc.findtext('TYPE')
        notes = misc.findtext('NOTES')
        yield {
            'type': 'misc',
            'name': name,
            'notes': notes,
        }

async def populate_ingredient_base(db: AsyncSession):
    # Solo poblar si está vacío
    result = await db.execute(select(IngredientBase.id))
    if result.first() is not None:
        return  # Ya hay datos
    files = [f for f in os.listdir(BEERSMITH_ROOT) if f.endswith('.bsmx')]
    for fname in files:
        path = os.path.join(BEERSMITH_ROOT, fname)
        for parser in [parse_grains_from_bsmx, parse_hops_from_bsmx, parse_yeasts_from_bsmx, parse_miscs_from_bsmx]:
            for ing in parser(path):
                if ing['name']:
                    exists = await db.execute(select(IngredientBase).where(IngredientBase.name==ing['name'], IngredientBase.type==ing['type']))
                    if not exists.scalar():
                        db.add(IngredientBase(**ing))
    await db.commit()

async def delete_ingredient_base(db: AsyncSession, ingredient_id: int):
    obj = await db.get(IngredientBase, ingredient_id)
    if obj:
        await db.delete(obj)
        await db.commit()

async def get_ingredient_base(db: AsyncSession, type_: str = None, search: str = None, origin: str = None, manufacturer: str = None, supplier: str = None):
    q = select(IngredientBase)
    if type_:
        q = q.where(IngredientBase.type==type_)
    if search:
        q = q.where(IngredientBase.name.ilike(f'%{search}%'))
    if origin:
        q = q.where(IngredientBase.origin.ilike(f'%{origin}%'))
    if manufacturer:
        q = q.where(IngredientBase.manufacturer.ilike(f'%{manufacturer}%'))
    if supplier:
        q = q.where(IngredientBase.supplier.ilike(f'%{supplier}%'))
    result = await db.execute(q)
    return result.scalars().all()
