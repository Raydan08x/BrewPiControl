import os
from lxml import etree as ET
from typing import Dict, Any

BEERSMITH_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../docs/DB_Beersmith3'))

class BeerSmithImportSummary:
    def __init__(self):
        self.grains = 0
        self.hops = 0
        self.yeasts = 0
        self.miscs = 0
        self.recipes = 0
        self.styles = 0
        self.water_profiles = 0
        self.equipment = 0

    def as_dict(self):
        return {
            'grains': self.grains,
            'hops': self.hops,
            'yeasts': self.yeasts,
            'miscs': self.miscs,
            'recipes': self.recipes,
            'styles': self.styles,
            'water_profiles': self.water_profiles,
            'equipment': self.equipment,
        }

def parse_bsmx_file(filepath: str) -> Dict[str, Any]:
    summary = BeerSmithImportSummary()
    try:
        parser = ET.XMLParser(recover=True, resolve_entities=True)
        tree = ET.parse(filepath, parser)
        root = tree.getroot()
        tag_map = {
            'Grain': 'grains',
            'Hop': 'hops',
            'Yeast': 'yeasts',
            'Misc': 'miscs',
            'Recipe': 'recipes',
            'Style': 'styles',
            'Water': 'water_profiles',
            'Equipment': 'equipment',
        }
        for tag, attr in tag_map.items():
            elems = root.findall(f'.//{tag}')
            setattr(summary, attr, len(elems))
        return summary.as_dict()
    except Exception as e:
        return {"error": f"Parse error: {str(e)}"}

def scan_beersmith_db() -> Dict[str, Any]:
    """Scan all BeerSmith .bsmx files and return a summary."""
    files = [f for f in os.listdir(BEERSMITH_ROOT) if f.endswith('.bsmx')]
    result = {}
    for fname in files:
        path = os.path.join(BEERSMITH_ROOT, fname)
        result[fname] = parse_bsmx_file(path)
    return result
