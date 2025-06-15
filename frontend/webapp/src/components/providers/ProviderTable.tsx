import React, { useState, useEffect, useRef } from 'react';
import { Edit3, Trash2, Check } from 'lucide-react';
import MoreVertical from 'lucide-react/dist/esm/icons/more-vertical';

export interface Provider {
  id: number;
  name: string;
  contact?: string;
  address?: string;
  phone?: string;
  email?: string;
  notes?: string;
  is_national?: boolean;
  country?: string;
}

export type ProviderColumnKey =
  | 'name'
  | 'contact'
  | 'address'
  | 'phone'
  | 'email'
  | 'is_national'
  | 'country'
  | 'notes'
  | 'actions';

interface Props {
  providers: Provider[];
  onEdit: (provider: Provider) => void;
  onDelete: (id: number) => void;
  /** Lista de columnas visibles. Si se omite se muestran todas. */
  visibleCols?: ProviderColumnKey[];
  onColumnToggle?: (columns: ProviderColumnKey[]) => void;
}

export function ProviderTable({ providers, onEdit, onDelete, visibleCols, onColumnToggle }: Props) {
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<ProviderColumnKey[]>(visibleCols || [
    'name', 'contact', 'address', 'phone', 'email', 'is_national', 'country', 'notes', 'actions'
  ]);
  const columnMenuRef = useRef<HTMLDivElement>(null);

  // Estados para paginación y scroll infinito
  const [paginationMode, setPaginationMode] = useState<'pagination' | 'infinite'>('pagination');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Calcular items paginados
  const totalPages = Math.max(1, Math.ceil(providers.length / itemsPerPage));
  const paginatedItems = paginationMode === 'pagination'
    ? providers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : providers;

  // Resetear página si cambia el modo o la cantidad de items por página
  useEffect(() => {
    setCurrentPage(1);
  }, [paginationMode, itemsPerPage, providers.length]);
  
  // Cerrar el menú de columnas al hacer clic afuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (columnMenuRef.current && !columnMenuRef.current.contains(event.target as Node)) {
        setShowColumnSelector(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const toggleColumn = (column: ProviderColumnKey) => {
    const newSelection = selectedColumns.includes(column) 
      ? selectedColumns.filter(col => col !== column)
      : [...selectedColumns, column];
    
    setSelectedColumns(newSelection);
    if (onColumnToggle) {
      onColumnToggle(newSelection);
    }
  };

  const cols: Array<{
    key: ProviderColumnKey;
    header: string;
    cell: (it: Provider) => React.ReactNode;
    sortable?: boolean;
  }> = [
    { key: 'name', header: 'Nombre', cell: it => it.name, sortable: true },
    { key: 'contact', header: 'Contacto', cell: it => it.contact ?? '-', sortable: true },
    { key: 'address', header: 'Dirección', cell: it => it.address ?? '-' },
    { key: 'phone', header: 'Teléfono', cell: it => it.phone ?? '-' },
    { key: 'email', header: 'Email', cell: it => it.email ?? '-', sortable: true },
    { key: 'is_national', header: 'Nacional', cell: it => (
      <span className={`px-2 py-1 rounded text-xs ${it.is_national ? 'bg-green-700/30 text-green-300' : 'bg-blue-700/30 text-blue-300'}`}>
        {it.is_national ? 'Nacional' : 'Internacional'}
      </span>
    ), sortable: true },
    { key: 'country', header: 'País', cell: it => it.is_national ? 'Colombia' : (it.country ?? '-'), sortable: true },
    { key: 'notes', header: 'Notas', cell: it => it.notes ?? '-' },
    {
      key: 'actions',
      header: 'Acciones',
      cell: (it: Provider) => (
        <div className="flex gap-2">
          <button
            className="p-1 rounded hover:bg-amber-700/30 text-amber-300 border border-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
            title="Editar"
            onClick={() => onEdit?.(it)}
          >
            <Edit3 size={16} />
          </button>
          <button
            className="p-1 rounded hover:bg-red-700/30 text-red-300 border border-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
            title="Eliminar"
            onClick={() => onDelete?.(it.id)}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  const usedCols = selectedColumns && selectedColumns.length ? cols.filter(c => selectedColumns.includes(c.key)) : cols;

  if (!providers.length) {
    return <div className="text-gray-500 dark:text-gray-400 mt-4">No hay proveedores registrados.</div>;
  }

  return (
    <div className="overflow-x-auto mt-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-gray-200 font-medium">Proveedores</h3>
        <div className="relative" ref={columnMenuRef}>
          <button 
            onClick={() => setShowColumnSelector(!showColumnSelector)}
            className="bg-gray-800 hover:bg-gray-700 text-gray-100 p-2 rounded border border-gray-700 flex items-center"
            aria-label="Mostrar selector de columnas"
          >
            <MoreVertical size={16} />
          </button>
          
          {showColumnSelector && (
            <div className="absolute right-0 bottom-0 transform translate-y-full z-10 bg-gray-800 border border-gray-700 rounded shadow-lg mt-1 p-2 w-40">
              {cols.map(col => (
                <div key={col.key} className="flex items-center p-1 hover:bg-gray-700 rounded">
                  <input
                    type="checkbox"
                    id={`col-${col.key}`}
                    checked={selectedColumns.includes(col.key)}
                    onChange={() => toggleColumn(col.key)}
                    className="hidden"
                  />
                  <label 
                    htmlFor={`col-${col.key}`} 
                    className="flex items-center cursor-pointer w-full text-gray-100 text-sm"
                  >
                    <span className={`flex items-center justify-center w-5 h-5 rounded mr-2 ${selectedColumns.includes(col.key) ? 'bg-blue-500' : 'border border-gray-600'}`}>
                      {selectedColumns.includes(col.key) && <Check size={14} className="text-white" />}
                    </span>
                    {col.header}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800 border-t border-gray-700">
          <tr>
            {usedCols.map(c => (
              <th
                key={c.key}
                className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {(paginationMode === 'pagination' ? paginatedItems : providers).map(provider => (
            <tr key={provider.id} className="hover:bg-gray-700">
              {usedCols.map(col => (
                <td
                  key={col.key}
                  className="px-4 py-2 whitespace-nowrap text-sm text-gray-200"
                >
                  {col.cell(provider)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Controles de paginación */}
      {paginationMode === 'pagination' && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-400 dark:border-gray-600 shadow-sm hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
          >
            &lt;
          </button>
          <span className="text-sm text-gray-800 dark:text-gray-200">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-400 dark:border-gray-600 shadow-sm hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
          >
            &gt;
          </button>
        </div>
      )}
      
      <div className="flex justify-center items-center gap-2 mt-2">
        <button
          onClick={() => setPaginationMode('pagination')}
          className={`px-2 py-1 rounded ${paginationMode === 'pagination' ? 'bg-gray-300 dark:bg-gray-600' : 'bg-gray-200 dark:bg-gray-700'} text-gray-900 dark:text-gray-100 border border-gray-400 dark:border-gray-600 shadow-sm`}
        >
          Paginación
        </button>
        <button
          onClick={() => setPaginationMode('infinite')}
          className={`px-2 py-1 rounded ${paginationMode === 'infinite' ? 'bg-gray-300 dark:bg-gray-600' : 'bg-gray-200 dark:bg-gray-700'} text-gray-900 dark:text-gray-100 border border-gray-400 dark:border-gray-600 shadow-sm`}
        >
          Scroll infinito
        </button>
      </div>
    </div>
  );
}
