import React, { useEffect, useState } from 'react';
import { ProviderTable, Provider } from '../components/providers/ProviderTable';
import { fetchProviders, addProvider, updateProvider, deleteProvider } from '../api/providers';
import { ProviderForm } from '../components/providers/ProviderForm';

export function Providers() {
  const [items, setItems] = useState<Provider[]>([]);
  const [filteredItems, setFilteredItems] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Provider | undefined>();
  const [filters, setFilters] = useState({
    isNational: null as boolean | null,
    country: '' as string
  });

  const load = async () => {
    try {
      setLoading(true);
      const data = await fetchProviders(search);
      setItems(data);
      applyFilters(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };
  
  const applyFilters = (data: Provider[]) => {
    let result = [...data];
    
    // Aplicar filtro por nacional/internacional
    if (filters.isNational !== null) {
      result = result.filter(item => item.is_national === filters.isNational);
    }
    
    // Aplicar filtro por país
    if (filters.country) {
      result = result.filter(item => item.country === filters.country);
    }
    
    setFilteredItems(result);
  };

  useEffect(() => {
    load();
  }, [search]);
  
  useEffect(() => {
    applyFilters(items);
  }, [filters, items]);

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
      <div className="flex flex-wrap items-center gap-2 mt-4">
        <input
          placeholder="Buscar proveedor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input w-64"
        />
        
        <div className="flex items-center gap-2">
          <select 
            value={filters.isNational === null ? '' : filters.isNational.toString()} 
            onChange={(e) => setFilters({
              ...filters, 
              isNational: e.target.value === '' ? null : e.target.value === 'true'
            })}
            className="input"
          >
            <option value="">Todos</option>
            <option value="true">Nacional</option>
            <option value="false">Internacional</option>
          </select>
          
          <select
            value={filters.country}
            onChange={(e) => setFilters({...filters, country: e.target.value})}
            className="input"
            disabled={filters.isNational === true}
          >
            <option value="">Todos los países</option>
            <option value="Colombia">Colombia</option>
            <option value="USA">Estados Unidos</option>
            <option value="México">México</option>
            <option value="Argentina">Argentina</option>
            <option value="España">España</option>
          </select>
        </div>
        
        <button className="btn-primary ml-auto" onClick={() => setShowModal(true)}>
          Agregar proveedor
        </button>
      </div>
      {error && <div className="text-red-400 mt-2">{error}</div>}
      {loading ? (
        <div className="text-gray-400 mt-4">Cargando...</div>
      ) : (
        <ProviderTable
          providers={filteredItems}
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
