import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { createItem, type InventoryItem } from '../../api/inventory';

interface Props {
  onCreated: () => void;
  onCancel: () => void;
}

// Campos mínimos requeridos por ItemCreate en backend
interface FormState {
  lot_number: string;
  name: string;
  category: string;
  quantity_available: string; // texto para fácil validación
  unit: string;
  manufacturer: string;
  origin: 'nacional' | 'importada';
  safety_stock: string;
  min_order_qty: string;
  package_size: string;
}

const CATEGORIES = ['malt', 'hop', 'yeast', 'additive', 'package', 'consumable'];

export function InventoryForm({ onCreated, onCancel }: Props) {
  const [form, setForm] = useState<FormState>({
    lot_number: '',
    name: '',
    category: 'malt',
    quantity_available: '',
    unit: 'kg',
    manufacturer: '',
    origin: 'nacional',
    safety_stock: '',
    min_order_qty: '',
    package_size: '',
  });
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.lot_number.trim() || !form.name.trim()) return;
    const qty = parseFloat(form.quantity_available);
    if (Number.isNaN(qty) || qty < 0) {
      toast.error('Cantidad inválida');
      return;
    }
    try {
      setLoading(true);
      const payload = {
        ...form,
        quantity_available: qty,
        manufacturer: form.manufacturer || null,
        origin: form.origin || null,
        safety_stock: form.safety_stock ? parseFloat(form.safety_stock) : null,
        min_order_qty: form.min_order_qty ? parseFloat(form.min_order_qty) : null,
        package_size: form.package_size || null,
      } as unknown as InventoryItem; // createItem cast internally
      await createItem(payload);
      toast.success('Item creado');
      onCreated();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Lote *</label>
          <input
            name="lot_number"
            value={form.lot_number}
            onChange={handleChange}
            required
            className="input w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Nombre *</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="input w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Categoría</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="input w-full"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c} className="capitalize">
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Unidad</label>
          <input name="unit" value={form.unit} onChange={handleChange} className="input w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Cantidad *</label>
          <input
            name="quantity_available"
            value={form.quantity_available}
            onChange={handleChange}
            required
            className="input w-full"
            type="number"
            step="any"
            min="0"
          />
        </div>
      </div>
      {showAdvanced && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Empresa (Fabricante)</label>
            <input name="manufacturer" value={form.manufacturer} onChange={handleChange} className="input w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Origen</label>
            <select name="origin" value={form.origin} onChange={handleChange} className="input w-full">
              <option value="nacional" className="capitalize">Nacional</option>
              <option value="importada" className="capitalize">Importada</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Stock de Seguridad</label>
            <input name="safety_stock" value={form.safety_stock} onChange={handleChange} className="input w-full" type="number" min="0" step="any" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Orden Mínima</label>
            <input name="min_order_qty" value={form.min_order_qty} onChange={handleChange} className="input w-full" type="number" min="0" step="any" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Embalaje</label>
            <input name="package_size" value={form.package_size} onChange={handleChange} className="input w-full" />
          </div>
        </div>
      )}
      <button type="button" className="text-xs underline" onClick={() => setShowAdvanced(!showAdvanced)}>
        {showAdvanced ? 'Ocultar datos avanzados' : 'Mostrar datos avanzados'}
      </button>
      <div className="flex gap-2 justify-end">
        <button type="button" className="btn-secondary" onClick={onCancel} disabled={loading}>
          Cancelar
        </button>
        <button type="submit" className="btn-primary" disabled={loading}>
          Guardar
        </button>
      </div>
    </form>
  );
}
