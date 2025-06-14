import React from 'react';
import { InventoryItem } from '../../api/inventory';
import { Edit3, Trash2 } from 'lucide-react';

interface Props {
  items: InventoryItem[];
  lowStock?: number;
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
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lote</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ubicación</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Caducidad</th>
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
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
                  {it.quantity_available} {it.unit}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
                  {it.location ?? '-'}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
                  {it.expiry_date ? new Date(it.expiry_date).toLocaleDateString() : '-'}
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
