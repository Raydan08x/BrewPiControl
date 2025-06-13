"""Módulo de importación masiva de inventario.

Acepta archivos .csv, .xlsx, .json y devuelve filas parseadas como dicts.
"""
from __future__ import annotations

import io
import pathlib
from typing import Any, List

import pandas as pd

REQUIRED_COLUMNS = {
    "lot_number",
    "name",
    "category",
    "quantity_available",
    "unit",
}

OPTIONAL_COLUMNS = {
    "supplier",
    "cost",
    "expiry_date",
    "location",
}

ALL_COLUMNS = REQUIRED_COLUMNS | OPTIONAL_COLUMNS


class ImportErrorReport(Exception):
    """Se lanza cuando el archivo carece de columnas requeridas."""

    def __init__(self, missing: set[str]):
        super().__init__(f"Faltan columnas requeridas: {', '.join(sorted(missing))}")
        self.missing = missing


async def parse_upload(filename: str, data: bytes) -> list[dict[str, Any]]:  # noqa: D401
    ext = pathlib.Path(filename).suffix.lower()
    if ext == ".csv":
        df = pd.read_csv(io.BytesIO(data))
    elif ext in {".xlsx", ".xls"}:
        df = pd.read_excel(io.BytesIO(data), engine="openpyxl")
    elif ext == ".json":
        df = pd.read_json(io.BytesIO(data))
    else:
        raise ValueError("Extensión de archivo no soportada")

    missing = REQUIRED_COLUMNS - set(df.columns)
    if missing:
        raise ImportErrorReport(missing)

    # Filtrar solo columnas relevantes y renombrar a strings
    df = df[[c for c in df.columns if c in ALL_COLUMNS]].copy()
    df.columns = [c.strip() for c in df.columns]

    # Garantizar tipos
    df["quantity_available"] = pd.to_numeric(df["quantity_available"], errors="coerce")
    df["cost"] = pd.to_numeric(df["cost"], errors="coerce") if "cost" in df else None

    records: List[dict[str, Any]] = df.to_dict(orient="records")
    return records
