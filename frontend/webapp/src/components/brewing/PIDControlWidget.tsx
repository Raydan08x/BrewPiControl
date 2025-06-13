import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Power, 
  TrendingUp, 
  Target,
  Thermometer,
  Zap
} from 'lucide-react';
import { useBrewery } from '../../contexts/BreweryContext';
import { PIDController } from '../../types/brewery';

interface PIDControlWidgetProps {
  controller: PIDController;
}

export function PIDControlWidget({ controller }: PIDControlWidgetProps) {
  const { dispatch } = useBrewery();
  const [showSettings, setShowSettings] = useState(false);
  const [tempSetpoint, setTempSetpoint] = useState(controller.setpoint);

  const error = controller.setpoint - controller.currentValue;
  const errorPercentage = Math.abs(error) / controller.setpoint * 100;

  const handleSetpointChange = () => {
    dispatch({
      type: 'SET_PID_SETPOINT',
      payload: { controllerId: controller.id, setpoint: tempSetpoint }
    });
  };

  const handleTogglePID = () => {
    dispatch({
      type: 'TOGGLE_PID',
      payload: controller.id
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black bg-opacity-40 backdrop-blur-sm rounded-lg border border-gray-600 overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              controller.enabled 
                ? 'bg-green-500 bg-opacity-20 text-green-400' 
                : 'bg-gray-500 bg-opacity-20 text-gray-400'
            }`}>
              <Target className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">{controller.name}</h3>
              <p className="text-gray-400 text-xs">
                Modo: {controller.mode === 'heating' ? 'Calentamiento' : 'Enfriamiento'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-1 text-gray-400 hover:text-white transition-colors"
            >
              <Settings className="h-4 w-4" />
            </button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleTogglePID}
              className={`p-2 rounded-lg transition-colors ${
                controller.enabled
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-600 text-gray-300'
              }`}
            >
              <Power className="h-3 w-3" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Valores principales */}
      <div className="p-4">
        <div className="grid grid-cols-3 gap-4 mb-4">
          {/* Valor actual */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Thermometer className="h-3 w-3 text-blue-400 mr-1" />
              <span className="text-xs text-gray-400">Actual</span>
            </div>
            <div className="text-lg font-bold text-white">
              {controller.currentValue.toFixed(1)}°C
            </div>
          </div>

          {/* Setpoint */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Target className="h-3 w-3 text-green-400 mr-1" />
              <span className="text-xs text-gray-400">Objetivo</span>
            </div>
            <div className="text-lg font-bold text-green-400">
              {controller.setpoint.toFixed(1)}°C
            </div>
          </div>

          {/* Salida */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Zap className="h-3 w-3 text-orange-400 mr-1" />
              <span className="text-xs text-gray-400">Salida</span>
            </div>
            <div className="text-lg font-bold text-orange-400">
              {controller.output.toFixed(0)}%
            </div>
          </div>
        </div>

        {/* Barra de progreso de la salida */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Potencia de salida</span>
            <span>{controller.output.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
              className={`h-2 rounded-full ${
                controller.mode === 'heating' 
                  ? 'bg-gradient-to-r from-orange-500 to-red-500'
                  : 'bg-gradient-to-r from-blue-500 to-cyan-500'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${controller.output}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Error */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Error:</span>
          <span className={`font-medium ${
            Math.abs(error) < 0.5 ? 'text-green-400' :
            Math.abs(error) < 2 ? 'text-yellow-400' :
            'text-red-400'
          }`}>
            {error > 0 ? '+' : ''}{error.toFixed(1)}°C
          </span>
        </div>

        {/* Control de setpoint rápido */}
        <div className="mt-4 p-3 bg-gray-800 bg-opacity-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400">Ajustar objetivo:</span>
            <div className="flex space-x-1">
              <button
                onClick={() => setTempSetpoint(Math.max(0, tempSetpoint - 1))}
                className="w-6 h-6 bg-gray-600 text-white rounded text-xs hover:bg-gray-500 transition-colors"
              >
                -
              </button>
              <input
                type="number"
                value={tempSetpoint}
                onChange={(e) => setTempSetpoint(parseFloat(e.target.value) || 0)}
                className="w-16 h-6 bg-gray-700 text-white text-xs text-center rounded border border-gray-600 focus:border-brewery-500 focus:outline-none"
                step="0.1"
                min="0"
                max="100"
              />
              <button
                onClick={() => setTempSetpoint(Math.min(100, tempSetpoint + 1))}
                className="w-6 h-6 bg-gray-600 text-white rounded text-xs hover:bg-gray-500 transition-colors"
              >
                +
              </button>
            </div>
          </div>
          
          {tempSetpoint !== controller.setpoint && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={handleSetpointChange}
              className="w-full py-1 bg-brewery-600 text-white text-xs rounded hover:bg-brewery-700 transition-colors"
            >
              Aplicar cambio
            </motion.button>
          )}
        </div>
      </div>

      {/* Panel de configuración avanzada */}
      {showSettings && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-t border-gray-600 p-4 bg-gray-800 bg-opacity-50"
        >
          <h4 className="text-white font-medium text-sm mb-3">Parámetros PID</h4>
          
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-gray-400">Kp</label>
              <input
                type="number"
                value={controller.kp}
                className="w-full mt-1 px-2 py-1 bg-gray-700 text-white text-xs rounded border border-gray-600 focus:border-brewery-500 focus:outline-none"
                step="0.1"
              />
            </div>
            
            <div>
              <label className="text-xs text-gray-400">Ki</label>
              <input
                type="number"
                value={controller.ki}
                className="w-full mt-1 px-2 py-1 bg-gray-700 text-white text-xs rounded border border-gray-600 focus:border-brewery-500 focus:outline-none"
                step="0.01"
              />
            </div>
            
            <div>
              <label className="text-xs text-gray-400">Kd</label>
              <input
                type="number"
                value={controller.kd}
                className="w-full mt-1 px-2 py-1 bg-gray-700 text-white text-xs rounded border border-gray-600 focus:border-brewery-500 focus:outline-none"
                step="0.01"
              />
            </div>
          </div>

          <div className="mt-3 flex justify-between">
            <button className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-500 transition-colors">
              Autoajuste
            </button>
            <button className="px-3 py-1 bg-brewery-600 text-white text-xs rounded hover:bg-brewery-700 transition-colors">
              Guardar
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}