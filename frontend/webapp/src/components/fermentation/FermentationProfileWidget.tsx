import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Play, 
  Pause, 
  RotateCcw,
  Plus,
  Trash2,
  Edit
} from 'lucide-react';
import { useBrewery } from '../../contexts/BreweryContext';

export function FermentationProfileWidget() {
  const { state } = useBrewery();
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const profile = selectedProfile ? 
    state.fermentationProfiles.find(p => p.id === selectedProfile) :
    state.fermentationProfiles[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black bg-opacity-40 backdrop-blur-sm rounded-lg border border-gray-600 p-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold flex items-center">
          <Settings className="h-4 w-4 mr-2" />
          Perfil de Fermentación
        </h3>
        
        <div className="flex space-x-1">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-1 text-gray-400 hover:text-white transition-colors"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button className="p-1 text-gray-400 hover:text-white transition-colors">
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Selector de perfil */}
      <div className="mb-4">
        <select
          value={selectedProfile || ''}
          onChange={(e) => setSelectedProfile(e.target.value)}
          className="w-full bg-gray-700 text-white text-sm rounded border border-gray-600 px-3 py-2 focus:border-purple-500 focus:outline-none"
        >
          {state.fermentationProfiles.map(profile => (
            <option key={profile.id} value={profile.id}>
              {profile.name}
            </option>
          ))}
        </select>
      </div>

      {/* Pasos del perfil */}
      {profile && (
        <div className="space-y-3">
          <div className="text-sm text-gray-400 mb-2">
            Pasos de fermentación:
          </div>
          
          {profile.steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800 bg-opacity-50 rounded p-3"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  <span className="text-white font-medium text-sm">
                    Paso {index + 1}
                  </span>
                </div>
                
                {isEditing && (
                  <button className="p-1 text-red-400 hover:text-red-300 transition-colors">
                    <Trash2 className="h-3 w-3" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-400">Temperatura:</span>
                  <div className="text-white font-mono">
                    {isEditing ? (
                      <input
                        type="number"
                        value={step.temperature}
                        className="w-full bg-gray-700 text-white px-2 py-1 rounded text-xs"
                        step="0.1"
                      />
                    ) : (
                      `${step.temperature}°C`
                    )}
                  </div>
                </div>
                
                <div>
                  <span className="text-gray-400">Duración:</span>
                  <div className="text-white font-mono">
                    {isEditing ? (
                      <input
                        type="number"
                        value={step.duration}
                        className="w-full bg-gray-700 text-white px-2 py-1 rounded text-xs"
                      />
                    ) : (
                      `${step.duration}h`
                    )}
                  </div>
                </div>
              </div>

              {step.rampRate && (
                <div className="mt-2 text-xs text-gray-400">
                  Rampa: {step.rampRate}°C/h
                </div>
              )}

              {/* Barra de progreso del paso */}
              <div className="mt-3">
                <div className="w-full bg-gray-700 rounded-full h-1">
                  <motion.div
                    className="bg-gradient-to-r from-purple-400 to-purple-600 h-1 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.random() * 100}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Progreso</span>
                  <span>{Math.floor(Math.random() * 100)}%</span>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Controles del perfil */}
          <div className="flex space-x-2 pt-3 border-t border-gray-700">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 flex items-center justify-center space-x-2 py-2 px-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              <Play className="h-4 w-4" />
              <span>Iniciar</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center space-x-2 py-2 px-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors"
            >
              <Pause className="h-4 w-4" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center space-x-2 py-2 px-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
            </motion.button>
          </div>

          {/* Información adicional */}
          <div className="mt-4 p-3 bg-gray-800 bg-opacity-30 rounded text-xs text-gray-400">
            <div className="flex justify-between mb-1">
              <span>Duración total:</span>
              <span>{profile.steps.reduce((acc, step) => acc + step.duration, 0)}h</span>
            </div>
            <div className="flex justify-between">
              <span>Temperatura promedio:</span>
              <span>
                {(profile.steps.reduce((acc, step) => acc + step.temperature, 0) / profile.steps.length).toFixed(1)}°C
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Botones de acción para edición */}
      {isEditing && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex space-x-2 mt-4 pt-3 border-t border-gray-700"
        >
          <button className="flex-1 py-2 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition-colors">
            Guardar Cambios
          </button>
          <button 
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
          >
            Cancelar
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}