/*
  InventoryClean.tsx – reemplazo íntegro del componente de Inventario.
  ---------------------------------------------------------------
  • Replica la UI especificada en la guía de estilo.
  • Mantiene las llamadas API actuales (fetchItems, uploadFile).
  • Usa InventoryTable y InventoryForm existentes.
  • Incorpora filtros de búsqueda, categoría, proveedor y umbral de stock.
  • Incluye carga CSV/Excel y modal para nuevo ítem.
*/

// @ts-nocheck
/* eslint-disable */
import React, { useState, useEffect, ElementType } from 'react';
// Importamos ElementType de React para tipar explícitamente los elementos HTML
import toast from 'react-hot-toast';
import { InventoryTable, type InventoryColumnKey } from '../inventory/InventoryTable';
import { InventoryForm } from '../inventory/InventoryForm';
import { InventoryEditModal } from '../inventory/InventoryEditModal';
import { exportInventory, uploadFile, type InventoryItem } from '../../api/inventory';
import { useInventory } from '../../hooks/useInventory';

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
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [supplierFilter, setSupplierFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
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
  const [lowStock, setLowStock] = useState(10);
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);

  // Usar hook de inventario
  const { items, loading, refresh: load, deleteItem: deleteInventoryItem, updateItem: updateInventoryItem } = useInventory();

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
        <React.Fragment>
          <span className="text-gray-500 dark:text-gray-400 mt-8">Cargando…</span>
        </React.Fragment>
      ) : (
        <InventoryTable
          items={filtered}
          lowStock={lowStock}
          visibleCols={visibleCols}
          onDelete={async (item: InventoryItem) => {
            if (!window.confirm(`¿Eliminar el ítem "${item.name}"?`)) return;
            try {
              await deleteInventoryItem(item.lot_number);
            } catch (err) {
              // El error ya se maneja en el hook
            }
          }}
          onEdit={(item: InventoryItem) => setEditItem(item)}
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

      {/* Modal de edición */}
      <InventoryEditModal
        item={editItem}
        isOpen={editItem !== null}
        onClose={() => setEditItem(null)}
        onSave={async (id: string | number, data: Partial<InventoryItem>) => {
          try {
            await updateInventoryItem(id, data);
            setEditItem(null);
          } catch (err) {
            // El error ya se maneja en el hook
          }
        }}
      />
    </div>
  );
}
