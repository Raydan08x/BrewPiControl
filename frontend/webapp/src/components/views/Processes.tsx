import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Filter, Play, Pause, Square, CheckCircle2 } from 'lucide-react';
import { useBrewery } from '../../contexts/BreweryContext';
import { ProcessWidget } from '../widgets/ProcessWidget';

export function Processes() {
  const { state } = useBrewery();

  // Filtro por estado de proceso
  const [statusFilter, setStatusFilter] = useState<'all' | 'running' | 'paused' | 'completed' | 'error'>('all');

  const filteredProcesses = state.processes.filter((p) =>
    statusFilter === 'all' ? true : p.status === statusFilter,
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Control de Procesos</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Gestión avanzada de procesos de elaboración
          </p>
        </div>

        <div className="flex space-x-2">
          {/* Botón para crear nuevo proceso (placeholder) */}
          <button className="flex items-center space-x-2 bg-brewery-600 text-white px-4 py-2 rounded-lg hover:bg-brewery-700 transition-colors">
            <Plus className="h-4 w-4" />
            <span>Nuevo Proceso</span>
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex items-center space-x-2">
        <Filter className="h-4 w-4 text-gray-500" />
        {(['all', 'running', 'paused', 'completed', 'error'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1 rounded-full text-sm transition-colors capitalize ${
              statusFilter === status
                ? 'bg-brewery-600 text-white'
                : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {status === 'all' ? 'Todos' : status}
          </button>
        ))}
      </div>

      {/* Grid de procesos */}
      {filteredProcesses.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
          <CheckCircle2 className="h-6 w-6 mr-2" />
          No hay procesos en esta categoría.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProcesses.map((process, index) => (
            <ProcessWidget key={process.id} processId={process.id} />
          ))}
        </div>
      )}
    </div>
  );
}
