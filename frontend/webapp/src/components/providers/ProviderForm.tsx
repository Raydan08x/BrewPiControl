import React, { useState } from 'react';
import toast from 'react-hot-toast';
import type { Provider } from './ProviderTable';
import { FiCheck, FiX } from 'react-icons/fi';

interface Props {
  provider?: Provider;
  onSave: (data: Omit<Provider, 'id'>) => void;
  onCancel: () => void;
}

export function ProviderForm({ provider, onSave, onCancel }: Props) {
  const [form, setForm] = useState<Omit<Provider, 'id'>>({
    name: provider?.name || '',
    contact: provider?.contact || '',
    address: provider?.address || '',
    phone: provider?.phone || '',
    email: provider?.email || '',
    notes: provider?.notes || '',
    is_national: provider?.is_national || false,
    country: provider?.country || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones simples
    if (!form.name.trim()) {
      toast.error('El nombre es obligatorio');
      return;
    }
    if (form.email && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email)) {
      toast.error('Email no válido');
      return;
    }

        onSave(form);
    toast.success('Proveedor guardado correctamente');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Nombre *</label>
        <input name="name" value={form.name} onChange={handleChange} required className="input w-full" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Contacto</label>
        <input name="contact" value={form.contact} onChange={handleChange} className="input w-full" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Dirección</label>
        <input name="address" value={form.address} onChange={handleChange} className="input w-full" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Teléfono</label>
        <input name="phone" value={form.phone} onChange={handleChange} className="input w-full" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Email</label>
        <input name="email" value={form.email} onChange={handleChange} className="input w-full" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Notas</label>
        <textarea name="notes" value={form.notes} onChange={handleChange} className="input w-full" />
      </div>
      <div className="flex justify-between gap-4">
        <div className="flex-1">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              name="is_national"
              checked={form.is_national || false}
              onChange={(e) => setForm({ ...form, is_national: e.target.checked })}
              className="form-checkbox h-4 w-4 text-blue-500"
            />
            Es proveedor nacional
          </label>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">País</label>
          <select
            name="country"
            value={form.country || ''}
            onChange={handleChange}
            className="input w-full"
            disabled={form.is_national}
          >
            <option value="">Seleccionar país...</option>
            <option value="Colombia">Colombia</option>
            <option value="USA">Estados Unidos</option>
            <option value="México">México</option>
            <option value="Argentina">Argentina</option>
            <option value="España">España</option>
            {/* Otros países aquí */}
          </select>
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="btn-secondary flex items-center gap-1">
          <FiX /> Cancelar
        </button>
        <button type="submit" className="btn-primary flex items-center gap-1">
          <FiCheck /> Guardar
        </button>
      </div>
    </form>
  );
}
