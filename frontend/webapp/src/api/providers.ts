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
  const url = search ? `${base}/?search=${encodeURIComponent(search)}` : `${base}/`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Error al obtener proveedores');
  return res.json();
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
