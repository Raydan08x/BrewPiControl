/* eslint-disable react/jsx-key */
import React from 'react';
import { InventoryItem } from '../../api/inventory';
import { Edit3, Trash2 } from 'lucide-react';

// Colores por categoría para badge
const categoryColors: Record<string, string> = {
  malt: 'bg-amber-600/20 text-amber-300',
  hop: 'bg-emerald-600/20 text-emerald-300',
  yeast: 'bg-violet-600/20 text-violet-300',
  additive: 'bg-sky-600/20 text-sky-300',
  package: 'bg-orange-600/20 text-orange-300',
  consumable: 'bg-rose-600/20 text-rose-300',
  maintenance: 'bg-gray-600/20 text-gray-300',
};

interface Props {
  items: InventoryItem[];
  lowStock?: number;
}

export default function InventoryTable({ items, lowStock = 10 }: Props) {
  if (!items.length) {
    return <div className="text-gray-500 dark:text-gray-400 mt-4">No hay registros.</div>;
  }

  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lote</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empresa</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ubicación</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Caducidad</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proveedor</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Seg.</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ord. Mín.</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Embalaje</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origen</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-800">
          {items.map((it) => {
            const low = it.quantity_available < lowStock;
            return (
              <tr
                key={it.lot_number}
                className={`hover:bg-gray-50 dark:hover:bg-gray-800 ${low ? 'bg-red-50 dark:bg-red-950' : ''}`}
              >
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {it.lot_number}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
                  {it.name}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm">
                  <span
                    className={`badge ${
                      categoryColors[it.category] ?? 'bg-gray-600/20 text-gray-300'
                    } capitalize`}
                  >
                    {it.category}
                  </span>
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-200">
                  {it.quantity_available} {it.unit}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-200">
                  {it.manufacturer ?? '-'}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
                  {it.location ?? '-'}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
                  {it.expiry_date ? new Date(it.expiry_date).toLocaleDateString() : '-'}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-200">
                  {it.supplier ?? '-'}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-200">
                  {it.safety_stock ?? '-'}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-200">
                  {it.min_order_qty ?? '-'}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-200">
                  {it.package_size ?? '-'}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-200 capitalize">
                  {it.origin ?? '-'}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 flex gap-2">
                  <button className="text-brewery-600 hover:text-brewery-700" title="Editar">
                    <Edit3 size={16} />
                  </button>
                  <button className="text-red-600 hover:text-red-700" title="Eliminar">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
 from 'react';
import { InventoryItem } from '../../api/inventory';
import { Edit3, Trash2 } from 'lucide-react';

// Colores por categoría para badge
const categoryColors: Record<string, string> = {
  malt: 'bg-amber-600/20 text-amber-300',
  hop: 'bg-emerald-600/20 text-emerald-300',
  yeast: 'bg-violet-600/20 text-violet-300',
  additive: 'bg-sky-600/20 text-sky-300',
  package: 'bg-orange-600/20 text-orange-300',
  consumable: 'bg-rose-600/20 text-rose-300',
  maintenance: 'bg-gray-600/20 text-gray-300',
};

interface Props {
  items: InventoryItem[];
  lowStock?: number;
  visibleCols?: string[];
}
  items: InventoryItem[];
  lowStock?: number;
  visibleCols: string[];
}

export function InventoryTable({ items, lowStock = 10 }: Props) {
  if (!items.length) {
    return (
      <div className="text-gray-500 dark:text-gray-400 mt-4">No hay registros.</div>
    );
  }
  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            lot_number') && (
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lote</th>
          )}
            name') && (
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
          )}
            category') && (
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
          )}
            stock') && (
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
          )}
            manufacturer') && (
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empresa</th>
          )}
            location') && (
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ubicación</th>
          )}
            expiry_date') && (
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Caducidad</th>
          )}
            supplier') && (
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proveedor</th>
          )}
             safety_stock') && (
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Seg.</th>
          )}
             min_order_qty') && (
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ord. Mín.</th>
          )}
             package_size') && (
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Embalaje</th>
          )}
            origin') && (
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origen</th>
          )}
            actions') && (
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-800">
          {items.map((it) => {
            const low = it.quantity_available < lowStock;
            return (
              <tr
                key={it.lot_number}
                className={`hover:bg-gray-50 dark:hover:bg-gray-800 ${low ? 'bg-red-50 dark:bg-red-950' : ''}`}
              >
                lot_number') && (
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {it.lot_number}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
                  {it.name}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm">
                  <span className={`badge ${categoryColors[it.category] ?? 'bg-gray-600/20 text-gray-300'} capitalize`}>
                    {it.category}
                  </span>
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-200">
                  {it.quantity_available} {it.unit}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-200">
                  {it.manufacturer ?? '-'}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
                  {it.location ?? '-'}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
                  {it.expiry_date ? new Date(it.expiry_date).toLocaleDateString() : '-'}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-200">
                  {it.supplier ?? '-'}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-200">
                  {it.safety_stock ?? '-'}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-200">
                  {it.min_order_qty ?? '-'}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-200">
                  {it.package_size ?? '-'}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-200 capitalize">
                  {it.origin ?? '-'}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 flex gap-2">
                  <button className="text-brewery-600 hover:text-brewery-700" title="Editar">
                    <Edit3 size={16} />
                  </button>
                  <button className="text-red-600 hover:text-red-700" title="Eliminar">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
