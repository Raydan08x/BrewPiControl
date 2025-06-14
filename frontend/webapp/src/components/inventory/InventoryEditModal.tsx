import React, { useState, useEffect, ReactElement } from 'react';
import { X } from 'lucide-react';
import { CATEGORIES } from '../../constants';
import type { InventoryItem } from '../../api/inventory';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      div: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
      form: React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;
      h2: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      button: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
      label: React.DetailedHTMLProps<React.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>;
      input: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
      select: React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>;
      option: React.DetailedHTMLProps<React.OptionHTMLAttributes<HTMLOptionElement>, HTMLOptionElement>;
    }
  }
}

interface Props {
  item: InventoryItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string | number, data: Partial<InventoryItem>) => Promise<void>;
}

export function InventoryEditModal({ item, isOpen, onClose, onSave }: Props) {
  const [form, setForm] = useState<Partial<InventoryItem>>({});
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Reset form when item changes
  useEffect(() => {
    if (item) {
      setForm({ ...item });
      // Show advanced if any advanced field is filled
      const hasAdvancedData = !!(
        item.manufacturer || 
        item.origin || 
        item.safety_stock || 
        item.min_order_qty || 
        item.package_size
      );
      setShowAdvanced(hasAdvancedData);
    }
  }, [item]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Convert number fields to numbers
    if (type === 'number') {
      setForm(prev => ({
        ...prev,
        [name]: value === '' ? null : Number(value),
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item?.lot_number) return;
    
    try {
      setLoading(true);
      await onSave(item.lot_number, form);
      onClose();
    } catch (error) {
      // Error handling is done in the onSave function
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-auto">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Editar ítem de inventario</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Lote *</label>
              <input 
                name="lot_number" 
                value={form.lot_number || ''} 
                onChange={handleChange} 
                className="input w-full text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700" 
                disabled 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Nombre *</label>
              <input 
                name="name" 
                value={form.name || ''} 
                onChange={handleChange} 
                className="input w-full text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Categoría</label>
              <select
                name="category"
                value={form.category || ''}
                onChange={handleChange}
                className="input w-full text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="capitalize text-gray-800 dark:text-gray-100">
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Unidad</label>
              <input 
                name="unit" 
                value={form.unit || ''} 
                onChange={handleChange} 
                className="input w-full text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Cantidad *</label>
              <input
                name="quantity_available"
                value={form.quantity_available || ''}
                onChange={handleChange}
                required
                className="input w-full text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                type="number"
                step="any"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Ubicación</label>
              <input 
                name="location" 
                value={form.location || ''} 
                onChange={handleChange} 
                className="input w-full text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700" 
              />
            </div>
          </div>

          {showAdvanced && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Empresa (Fabricante)</label>
                <input 
                  name="manufacturer" 
                  value={form.manufacturer || ''} 
                  onChange={handleChange} 
                  className="input w-full text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Origen</label>
                <select 
                  name="origin" 
                  value={form.origin || ''} 
                  onChange={handleChange} 
                  className="input w-full text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                >
                  <option value="">-</option>
                  <option value="nacional" className="capitalize text-gray-800 dark:text-gray-100">Nacional</option>
                  <option value="importada" className="capitalize text-gray-800 dark:text-gray-100">Importada</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Stock de Seguridad</label>
                <input 
                  name="safety_stock" 
                  value={form.safety_stock || ''} 
                  onChange={handleChange} 
                  className="input w-full text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700" 
                  type="number" 
                  min="0" 
                  step="any" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Orden Mínima</label>
                <input 
                  name="min_order_qty" 
                  value={form.min_order_qty || ''} 
                  onChange={handleChange} 
                  className="input w-full text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700" 
                  type="number" 
                  min="0" 
                  step="any" 
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Embalaje</label>
                <input 
                  name="package_size" 
                  value={form.package_size || ''} 
                  onChange={handleChange} 
                  className="input w-full text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700" 
                />
              </div>
            </div>
          )}
          <button 
            type="button" 
            className="text-xs underline text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300" 
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? 'Ocultar datos avanzados' : 'Mostrar datos avanzados'}
          </button>
          <div className="flex gap-2 justify-end">
            <button 
              type="button" 
              className="btn-secondary text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600" 
              onClick={onClose} 
              disabled={loading}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn-primary text-white bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600" 
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
