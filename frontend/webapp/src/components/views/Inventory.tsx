/*
  InventoryClean.tsx – reemplazo íntegro del componente de Inventario.
  ---------------------------------------------------------------
  • Replica la UI especificada en la guía de estilo.
  • Mantiene las llamadas API actuales (fetchItems, uploadFile).
  • Usa InventoryTable y InventoryForm existentes.
  • Incorpora filtros de búsqueda, categoría, proveedor y umbral de stock.
  • Incluye carga CSV/Excel y modal para nuevo ítem.
*/

import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { exportInventory } from '../../api/inventory';
import type { InventoryColumnKey } from '../inventory/InventoryTable';
import { fetchItems, uploadFile, type InventoryItem } from '../../api/inventory';
import { InventoryTable } from '../inventory/InventoryTable';
import { InventoryForm } from '../inventory/InventoryForm';

// Catálogo fijo de categorías empleadas por el backend
const categories: Array<InventoryItem['category']> = [
  'malt',
  'hop',
  'yeast',
  'additive',
  'package',
  'consumable',
  'maintenance',
];

export function Inventory() {
  /* ------------------------- State ------------------------- */
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | InventoryItem['category']>('all');
  const [supplierFilter, setSupplierFilter] = useState<string>('all');
  const [lowStock, setLowStock] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  // columnas visibles (persisten en localStorage)
  const allColumns: InventoryColumnKey[] = [
    'lot_number',
    'name',
    'category',
    'stock',
    'manufacturer',
    'location',
    'expiry_date',
    'supplier',
    'safety_stock',
    'min_order_qty',
    'package_size',
    'origin',
    'actions',
  ];
  const [visibleCols, setVisibleCols] = useState<InventoryColumnKey[]>(() => {
    const stored = localStorage.getItem('inventory_visible_cols');
    return stored ? (JSON.parse(stored) as InventoryColumnKey[]) : allColumns;
  });
  const [showColMenu, setShowColMenu] = useState(false);

  /* ------------------------- Handlers ---------------------- */
  // Exporta CSV
  const handleExport = async () => {
    try {
      toast.loading('Generando CSV…');
      const blob = await exportInventory();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'inventario.csv';
      a.click();
      URL.revokeObjectURL(url);
      toast.dismiss();
    } catch (err: any) {
      toast.dismiss();
      toast.error(err.message ?? 'Error al exportar');
    }
  };
  // Descarga inventario del backend
  const load = async () => {
    try {
      setLoading(true);
      const data = await fetchItems();
      setItems(data);
    } catch (err: any) {
      toast.error(err.message ?? 'Error al cargar inventario');
    } finally {
      setLoading(false);
    }
  };

  // Importa archivo CSV/XLSX
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      toast.loading('Importando…');
      await uploadFile(file);
      toast.dismiss();
      toast.success('Importación completada');
      await load();
    } catch (err: any) {
      toast.dismiss();
      toast.error(err.message ?? 'Error al importar');
    }
  };

  /* ------------------------- Effects ----------------------- */
  useEffect(() => {
    void load();
  }, []);

  /* ------------------------- Derived data ------------------ */
  // Lista única de proveedores para el selector
  const suppliers = Array.from(new Set(items.map(i => i.supplier).filter(Boolean))) as string[];

  // Filtrado texto (nombre o lote)
  const textFiltered = search.trim()
    ? items.filter(i =>
        i.name.toLowerCase().includes(search.toLowerCase()) ||
        (i.lot_number ?? '').toLowerCase().includes(search.toLowerCase()),
      )
    : items;

  // Filtrado por categoría -> proveedor
  const categoryFiltered =
    categoryFilter === 'all' ? textFiltered : textFiltered.filter(i => i.category === categoryFilter);
  const filtered = supplierFilter === 'all' ? categoryFiltered : categoryFiltered.filter(i => i.supplier === supplierFilter);

  /* ------------------------- Render ------------------------ */
  return (
    <div className="p-6 flex flex-col gap-6 h-full">
      {/* Barra de controles */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex flex-wrap gap-3 items-center justify-between">
        {/* Título */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Inventario</h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm">Gestión de materias primas y suministros</p>
        </div>

        {/* Controles */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* Búsqueda */}
          <input
            className="input w-48 md:w-64 text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="Buscar…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          {/* Categoría */}
          <select
            className="input w-44 capitalize text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400"
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value as any)}
          >
            <option value="all">Todas las categorías</option>
            {categories.map(cat => (
              <option key={cat} value={cat} className="capitalize text-gray-800 dark:text-gray-100">
                {cat}
              </option>
            ))}
          </select>

          {/* Proveedor */}
          <select
            className="input w-52 text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400"
            value={supplierFilter}
            onChange={e => setSupplierFilter(e.target.value)}
          >
            <option value="all">Todos los proveedores</option>
            {suppliers.map(s => (
              <option key={s} value={s} className="text-gray-800 dark:text-gray-100">
                {s}
              </option>
            ))}
          </select>

          {/* Umbral */}
          <label className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-1">
            Umbral stock:
            <input
              type="number"
              className="input w-20 text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
              min={0}
              value={lowStock}
              onChange={e => setLowStock(Number(e.target.value))}
            />
          </label>

          {/* Columnas */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowColMenu(v => !v)}
              className="px-4 py-2 rounded-md font-medium border border-gray-300 dark:border-gray-600 bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              Columnas
            </button>
            {showColMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 p-2 flex flex-col gap-1">
                {allColumns.filter(c=>c!=='actions').map(col => (
                  <label key={col} className="inline-flex items-center gap-2 text-sm capitalize">
                    <input
                      type="checkbox"
                      checked={visibleCols.includes(col)}
                      onChange={e => {
                        const next = e.target.checked
                          ? [...visibleCols, col]
                          : visibleCols.filter(c => c !== col);
                        setVisibleCols(next);
                        localStorage.setItem('inventory_visible_cols', JSON.stringify(next));
                      }}
                    />
                    {col.replace('_', ' ')}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Exportar */}
          <button className="btn-secondary" onClick={handleExport}>
            Exportar CSV
          </button>

          {/* Importar */}
          <label className="inline-flex items-center px-4 py-2 bg-brewery-600 text-white rounded-lg cursor-pointer hover:bg-brewery-700">
            Importar CSV/Excel
            <input type="file" accept=".csv,.xlsx" onChange={handleUpload} className="hidden" />
          </label>

          {/* Nuevo ítem */}
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            Nueva materia prima
          </button>
        </div>
      </div>

      {/* Tabla de inventario */}
      {loading ? (
        <div className="text-gray-500 dark:text-gray-400 mt-8">Cargando…</div>
      ) : (
        <InventoryTable
          items={filtered}
          lowStock={lowStock}
          visibleCols={visibleCols}
          onDelete={async (item) => {
            if (!window.confirm(`¿Eliminar el ítem "${item.name}"?`)) return;
            try {
              await fetch(`/api/inventory/items/${item.id}`, { method: 'DELETE' });
              toast.success('Ítem eliminado');
              await load();
            } catch (err: any) {
              toast.error(err.message ?? 'Error al eliminar');
            }
          }}
        />
      )}

      {/* Modal de alta */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-lg">
            <InventoryForm
              onCreated={() => {
                setShowModal(false);
                load();
              }}
              onCancel={() => setShowModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
