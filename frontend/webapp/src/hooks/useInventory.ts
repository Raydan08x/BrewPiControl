import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  fetchItems,
  createItem,
  updateItem,
  deleteItem,
  type InventoryItem
} from '../api/inventory';

export function useInventory() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carga inicial y recarga
  const refresh = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchItems();
      setItems(data);
      return data;
    } catch (err: any) {
      const message = err.message ?? 'Error al cargar inventario';
      setError(message);
      toast.error(message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Crear ítem
  const createItemAndRefresh = async (data: Partial<InventoryItem>) => {
    try {
      setLoading(true);
      setError(null);
      const newItem = await createItem(data);
      await refresh();
      toast.success('Ítem creado correctamente');
      return newItem;
    } catch (err: any) {
      const message = err.message ?? 'Error al crear ítem';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar ítem
  const updateItemAndRefresh = async (id: string | number, data: Partial<InventoryItem>) => {
    try {
      setLoading(true);
      setError(null);
      const updatedItem = await updateItem(id, data);
      await refresh();
      toast.success('Ítem actualizado correctamente');
      return updatedItem;
    } catch (err: any) {
      const message = err.message ?? 'Error al actualizar ítem';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar ítem
  const deleteItemAndRefresh = async (id: string | number) => {
    try {
      setLoading(true);
      setError(null);
      await deleteItem(id);
      await refresh();
      toast.success('Ítem eliminado correctamente');
    } catch (err: any) {
      const message = err.message ?? 'Error al eliminar ítem';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Carga inicial
  useEffect(() => {
    refresh();
  }, []);

  return {
    items,
    loading,
    error,
    refresh,
    createItem: createItemAndRefresh,
    updateItem: updateItemAndRefresh,
    deleteItem: deleteItemAndRefresh
  };
}
