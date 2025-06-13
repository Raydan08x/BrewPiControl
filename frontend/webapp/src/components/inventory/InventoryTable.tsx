import React from 'react';
import type { InventoryItem } from '../../api/inventory';

interface Props {
  items: InventoryItem[];
}

export function InventoryTable({ items }: Props) {
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
            {['Lote', 'Nombre', 'Stock', 'Ubicación', 'Caducidad'].map((h) => (
              <th
                key={h}
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-800">
          {items.map((it) => (
            <tr key={it.lot_number} className="hover:bg-gray-50 dark:hover:bg-gray-800">
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
