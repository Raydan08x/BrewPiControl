export interface Provider {
  id: number;
  name: string;
  is_national?: boolean;
  country?: string;
  contact?: string;
  address?: string;
  phone?: string;
  email?: string;
  notes?: string;
}

const base = '/api/providers';

export async function fetchProviders(search?: string): Promise<Provider[]> {
  try {
    const url = search ? `${base}/?q=${encodeURIComponent(search)}` : base;
    const res = await fetch(url);
    
    if (!res.ok) {
      throw new Error(`Error al obtener proveedores: ${res.statusText}`);
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching providers:', error);
    // Fallback a datos de prueba si hay un error
    return [
      { id: 1, name: 'TDCL (the drink craft labs)', is_national: false, country: 'USA' },
      { id: 2, name: 'Distriness', is_national: true, country: 'Colombia' },
    ];
  }
}

export async function addProvider(data: Omit<Provider, 'id'>): Promise<Provider> {
  const res = await fetch(base + '/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al agregar proveedor');
  return res.json();
}

export async function updateProvider(id: number, data: Omit<Provider, 'id'>): Promise<Provider> {
  const res = await fetch(`${base}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al editar proveedor');
  return res.json();
}

export async function deleteProvider(id: number): Promise<void> {
  const res = await fetch(`${base}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Error al eliminar proveedor');
}
