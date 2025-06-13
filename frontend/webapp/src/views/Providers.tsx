import React, { useEffect, useState } from 'react';
import { ProviderTable, Provider } from '../components/providers/ProviderTable';
import { fetchProviders, addProvider, updateProvider, deleteProvider } from '../api/providers';
import { ProviderForm } from '../components/providers/ProviderForm';

export function Providers() {
  const [items, setItems] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Provider | undefined>();

  const load = async () => {
    try {
      setLoading(true);
      const data = await fetchProviders(search);
      setItems(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [search]);

  const handleSave = async (data: Omit<Provider, 'id'>) => {
    try {
      if (editing) {
        await updateProvider(editing.id, data);
      } else {
        await addProvider(data);
      }
      setShowModal(false);
      setEditing(undefined);
      load();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar proveedor?')) return;
    try {
      await deleteProvider(id);
      load();
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold text-gray-100">Proveedores</h1>
      <div className="flex items-center gap-2 mt-4">
        <input
          placeholder="Buscar proveedor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input w-64"
        />
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          Agregar proveedor
        </button>
      </div>
      {error && <div className="text-red-400 mt-2">{error}</div>}
      {loading ? (
        <div className="text-gray-400 mt-4">Cargando...</div>
      ) : (
        <ProviderTable
          providers={items}
          onEdit={(p) => {
            setEditing(p);
            setShowModal(true);
          }}
          onDelete={handleDelete}
        />
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-lg">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">
              {editing ? 'Editar proveedor' : 'Nuevo proveedor'}
            </h2>
            <ProviderForm
              provider={editing}
              onSave={handleSave}
              onCancel={() => {
                setShowModal(false);
                setEditing(undefined);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
