export interface InventoryItem {
  lot_number: string;
  name: string;
  category: string;
  quantity_available: number;
  unit: string;
  location?: string;
  expiry_date?: string | null;
  supplier?: string | null;
  cost?: number | null;
}

const base = '/api/inventory';

export async function fetchItems(): Promise<InventoryItem[]> {
  const res = await fetch(`${base}/items`);
  if (!res.ok) throw new Error('Error al obtener inventario');
  return res.json();
}

export async function createItem(data: Partial<InventoryItem>): Promise<InventoryItem> {
  const res = await fetch(`${base}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear item');
  return res.json();
}

export async function uploadFile(file: File): Promise<void> {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${base}/import`, {
    method: 'POST',
    body: form,
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.detail ?? 'Error al importar');
  }
}
