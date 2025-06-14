import React, { useEffect, useState } from 'react';
import { InventoryForm } from '../inventory/InventoryForm';
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
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [lowStock, setLowStock] = useState<number>(10);

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

  const textFiltered = search.trim() ? items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase())) : items;
  const filtered = filter === 'all' ? textFiltered : textFiltered.filter((i) => i.category === filter);

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
        <div className="flex gap-2 mt-2">
          <input
            placeholder="Buscar…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input w-64"
          />
          {showModal && (
            <InventoryForm
              onCreated={() => {
                setShowModal(false);
                load();
              }}
              onCancel={() => setShowModal(false)}
            />
          )}
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            Nueva materia prima
          </button>
        </div>
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
        <InventoryTable items={filtered} lowStock={lowStock} />
      )}
      <div className="mt-4 flex items-center gap-2">
        <label className="text-sm text-gray-600 dark:text-gray-300">Umbral stock bajo:</label>
        <input
          type="number"
          min={0}
          value={lowStock}
          onChange={(e) => setLowStock(Number(e.target.value))}
          className="input w-20"
        />
      </div>

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
