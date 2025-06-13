import React from 'react';

import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { fetchItems, uploadFile, type InventoryItem } from '../../api/inventory';
import { InventoryTable } from '../inventory/InventoryTable';

const categories = [
  'malt',
  'hop',
  'yeast',
  'additive',
  'package',
  'consumable',
  'maintenance',
];

export function Inventory() {
    const [items, setItems] = useState<InventoryItem[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      setItems(await fetchItems());
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = filter === 'all' ? items : items.filter((i) => i.category === filter);

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
      toast.error(err.message);
    }
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Inventario</h1>
        <label className="inline-flex items-center px-4 py-2 bg-brewery-600 text-white rounded-lg cursor-pointer hover:bg-brewery-700">
          Importar CSV/Excel
          <input type="file" accept=".csv,.xlsx" onChange={handleUpload} className="hidden" />
        </label>
      </div>

      <div className="flex space-x-2 mt-6 overflow-x-auto">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded-md text-sm ${filter === 'all' ? 'bg-brewery-600 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
        >
          Todos
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1 rounded-md text-sm capitalize ${filter === cat ? 'bg-brewery-600 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="mt-8 text-gray-500 dark:text-gray-400">Cargando…</div>
      ) : (
        <InventoryTable items={filtered} />
      )}
    </div>
  );
}
