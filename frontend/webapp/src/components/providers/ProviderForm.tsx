import React, { useState } from 'react';
import toast from 'react-hot-toast';
import type { Provider } from './ProviderTable';

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
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
        <label className="block text-sm font-medium mb-1">Nombre *</label>
        <input name="name" value={form.name} onChange={handleChange} required className="input w-full" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Contacto</label>
        <input name="contact" value={form.contact} onChange={handleChange} className="input w-full" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Dirección</label>
        <input name="address" value={form.address} onChange={handleChange} className="input w-full" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Teléfono</label>
        <input name="phone" value={form.phone} onChange={handleChange} className="input w-full" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input name="email" value={form.email} onChange={handleChange} className="input w-full" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Notas</label>
        <textarea name="notes" value={form.notes} onChange={handleChange} className="input w-full" />
      </div>
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancelar</button>
        <button type="submit" className="btn-primary">Guardar</button>
      </div>
    </form>
  );
}
