// @ts-nocheck
/* eslint-disable */
import React, { ReactNode, useState, useRef, useEffect } from 'react';
import { Edit3, Trash2, MoreVertical, Check } from 'lucide-react';
import type { InventoryItem } from '../../api/inventory';
import { fetchProviders, type Provider } from '../../api/providers';

// Definiciones para solucionar problemas de tipado JSX
declare global {
  namespace JSX {
    interface IntrinsicElements {
      div: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
      span: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;
      button: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
      table: React.DetailedHTMLProps<React.TableHTMLAttributes<HTMLTableElement>, HTMLTableElement>;
      thead: React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;
      tbody: React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;
      tr: React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement>;
      th: React.DetailedHTMLProps<React.ThHTMLAttributes<HTMLTableHeaderCellElement>, HTMLTableHeaderCellElement>;
      td: React.DetailedHTMLProps<React.TdHTMLAttributes<HTMLTableDataCellElement>, HTMLTableDataCellElement>;
    }
    interface Element extends React.ReactNode {}
  }
}

// Colores por categoría
const categoryColors: Record<string, string> = {
  malt: 'bg-amber-600/20 text-amber-900 dark:text-amber-200',
  hop: 'bg-emerald-600/20 text-emerald-900 dark:text-emerald-200',
  yeast: 'bg-violet-600/20 text-violet-900 dark:text-violet-200',
  additive: 'bg-sky-600/20 text-sky-900 dark:text-sky-200',
  package: 'bg-orange-600/20 text-orange-900 dark:text-orange-200',
  consumable: 'bg-rose-600/20 text-rose-900 dark:text-rose-200',
  maintenance: 'bg-gray-600/20 text-gray-900 dark:text-gray-200',
};

export type InventoryColumnKey =
  | 'lot_number'
  | 'name'
  | 'category'
  | 'stock'
  | 'manufacturer'
  | 'location'
  | 'expiry_date'
  | 'supplier'
  | 'safety_stock'
  | 'min_order_qty'
  | 'package_size'
  | 'origin'
  | 'actions';

interface Props {
  items: InventoryItem[];
  lowStock?: number;
  /** Lista de columnas visibles. Si se omite se muestran todas. */
  visibleCols?: InventoryColumnKey[];
}

interface InventoryTableProps extends Props {
  onDelete?: (item: InventoryItem) => void;
  onEdit?: (item: InventoryItem) => void;
  onColumnToggle?: (columns: InventoryColumnKey[]) => void;
}

export function InventoryTable({ items, lowStock = 10, visibleCols, onDelete, onEdit, onColumnToggle }: InventoryTableProps) {
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<InventoryColumnKey[]>(visibleCols || [
    'lot_number', 'name', 'category', 'stock', 'manufacturer', 'location', 'expiry_date', 'supplier', 'actions'
  ]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const columnMenuRef = useRef<HTMLDivElement>(null);
  
  // Cargar proveedores
  useEffect(() => {
    const loadProviders = async () => {
      try {
        const data = await fetchProviders();
        setProviders(data);
      } catch (err) {
        console.error('Error al cargar proveedores', err);
      }
    };
    
    loadProviders();
  }, []);
  
  // Cerrar el menú de columnas al hacer clic afuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (columnMenuRef.current && !columnMenuRef.current.contains(event.target as Node)) {
        setShowColumnSelector(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const toggleColumn = (column: InventoryColumnKey) => {
    const newSelection = selectedColumns.includes(column) 
      ? selectedColumns.filter(col => col !== column)
      : [...selectedColumns, column];
    
    setSelectedColumns(newSelection);
    if (onColumnToggle) {
      onColumnToggle(newSelection);
    }
  };
  const cols: Array<{
    key: InventoryColumnKey;
    header: string;
    cell: (it: InventoryItem) => React.ReactNode;
  }> = [
    { key: 'lot_number', header: 'Lote', cell: it => it.lot_number },
    { key: 'name', header: 'Nombre', cell: it => it.name },
    {
      key: 'category',
      header: 'Categoría',
      cell: it => (
        <span className={`badge ${categoryColors[it.category] ?? 'bg-gray-600/20 text-gray-300'} capitalize`}>
          {it.category}
        </span>
      ),
    },
    {
      key: 'stock',
      header: 'Stock',
      cell: it => (
        <span>
          {it.quantity_available} {it.unit}
        </span>
      ),
    },
    { key: 'manufacturer', header: 'Empresa', cell: it => it.manufacturer ?? '-' },
    { key: 'location', header: 'Ubicación', cell: it => it.location ?? '-' },
    {
      key: 'expiry_date',
      header: 'Caducidad',
      cell: it => (it.expiry_date ? new Date(it.expiry_date).toLocaleDateString() : '-'),
    },
    { key: 'supplier', header: 'Proveedor', cell: it => it.supplier ?? '-' },
    { key: 'safety_stock', header: 'Stock Seg.', cell: it => it.safety_stock ?? '-' },
    { key: 'min_order_qty', header: 'Ord. Mín.', cell: it => it.min_order_qty ?? '-' },
    { key: 'package_size', header: 'Embalaje', cell: it => it.package_size ?? '-' },
    { key: 'origin', header: 'Origen', cell: it => it.origin ?? '-' },
    {
      key: 'actions',
      header: 'Acciones',
      cell: (it: InventoryItem): ReactNode => (
        <div className="flex gap-2">
          <button
            className="p-1 rounded hover:bg-amber-100 dark:hover:bg-amber-900/20 text-amber-700 dark:text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
            title="Editar"
            onClick={() => onEdit?.(it)}
          >
            <Edit3 size={16} />
          </button>
          <button
            className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/20 text-red-700 dark:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-400"
            title="Eliminar"
            onClick={() => onDelete?.(it)}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  const usedCols = selectedColumns && selectedColumns.length ? cols.filter(c => selectedColumns.includes(c.key)) : cols;

  if (!items.length) {
    return <div className="text-gray-500 dark:text-gray-400 mt-4">No hay registros.</div>;
  }

  return (
    <div className="overflow-x-auto mt-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-gray-200 font-medium">Inventario</h3>
        <div className="relative" ref={columnMenuRef}>
          <button 
            onClick={() => setShowColumnSelector(!showColumnSelector)}
            className="bg-gray-800 hover:bg-gray-700 text-gray-100 p-2 rounded border border-gray-700 flex items-center"
          >
            <MoreVertical size={16} />
          </button>
          
          {showColumnSelector && (
            <div className="absolute right-0 bottom-0 transform translate-y-full z-10 bg-gray-800 border border-gray-700 rounded shadow-lg mt-1 p-2 w-40">
              {cols.map(col => (
                <div key={col.key} className="flex items-center p-1 hover:bg-gray-700 rounded">
                  <input
                    type="checkbox"
                    id={`col-${col.key}`}
                    checked={selectedColumns.includes(col.key)}
                    onChange={() => toggleColumn(col.key)}
                    className="hidden"
                  />
                  <label 
                    htmlFor={`col-${col.key}`} 
                    className="flex items-center cursor-pointer w-full text-gray-100 text-sm"
                  >
                    <span className={`flex items-center justify-center w-5 h-5 rounded mr-2 ${selectedColumns.includes(col.key) ? 'bg-blue-500' : 'border border-gray-600'}`}>
                      {selectedColumns.includes(col.key) && <Check size={14} className="text-white" />}
                    </span>
                    {col.header}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800 border-t border-gray-700">
          <tr>
            {usedCols.map(c => (
              <th
                key={c.key}
                className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {items.map(it => {
            const low = it.quantity_available < lowStock;
            const provider = providers.find(p => p.id === it.provider_id);
            const itemWithProvider = {
              ...it,
              supplier: provider?.name || it.supplier || '-'
            };
            
            return (
              <tr
                key={it.lot_number}
                className={`hover:bg-gray-700 ${low ? 'bg-red-900/20' : ''}`}
              >
                {usedCols.map(col => (
                  <td
                    key={col.key}
                    className="px-4 py-2 whitespace-nowrap text-sm text-gray-200 capitalize"
                  >
                    {col.cell(itemWithProvider)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
