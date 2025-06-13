import React from 'react';

export interface Provider {
  id: number;
  name: string;
  contact?: string;
  address?: string;
  phone?: string;
  email?: string;
  notes?: string;
}

interface Props {
  providers: Provider[];
  onEdit: (provider: Provider) => void;
  onDelete: (id: number) => void;
}

export function ProviderTable({ providers, onEdit, onDelete }: Props) {
  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Nombre</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Contacto</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Dirección</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Teléfono</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Email</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Notas</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-800">
          {providers.map((prov) => (
            <tr key={prov.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{prov.name}</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{prov.contact ?? '-'}</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{prov.address ?? '-'}</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{prov.phone ?? '-'}</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{prov.email ?? '-'}</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{prov.notes ?? '-'}</td>
              <td className="px-4 py-2 whitespace-nowrap text-right">
                <button onClick={() => onEdit(prov)} className="text-blue-500 hover:underline mr-2">Editar</button>
                <button onClick={() => onDelete(prov.id)} className="text-red-500 hover:underline">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
