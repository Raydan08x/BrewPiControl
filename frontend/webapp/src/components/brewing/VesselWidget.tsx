import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Thermometer, 
  Zap, 
  Droplets, 
  Settings,
  TrendingUp,
  TrendingDown,
  Minus,
  Power
} from 'lucide-react';
import { useBrewery } from '../../contexts/BreweryContext';
import { Vessel } from '../../types/brewery';

interface VesselWidgetProps {
  vessel: Vessel;
  showConnections?: boolean;
}

export function VesselWidget({ vessel, showConnections = false }: VesselWidgetProps) {
  const { state, dispatch } = useBrewery();
  const [showDetails, setShowDetails] = useState(false);

  // Obtener sensor de temperatura
  const tempSensor = state.devices
    .flatMap(d => d.sensors)
    .find(s => s.id === vessel.temperature.sensorId);

  // Obtener elemento calefactor
  const heatingElement = vessel.heatingElement ? 
    state.devices
      .flatMap(d => d.equipment)
      .find(e => e.id === vessel.heatingElement!.equipmentId) : null;

  // Calcular nivel de llenado
  const fillPercentage = vessel.currentVolume ? 
    (vessel.currentVolume / vessel.volume) * 100 : 0;

  // Determinar color del líquido basado en el tipo de recipiente
  const getLiquidColor = () => {
    switch (vessel.type) {
      case 'mash_tun':
        return 'from-amber-400 to-amber-600';
      case 'boil_kettle':
        return 'from-orange-400 to-red-500';
      case 'fermenter':
        return 'from-yellow-400 to-amber-500';
      case 'brite_tank':
        return 'from-yellow-300 to-yellow-500';
      default:
        return 'from-blue-400 to-blue-600';
    }
  };

  // Obtener icono del recipiente
  const getVesselIcon = () => {
    switch (vessel.type) {
      case 'mash_tun':
        return '🌾';
      case 'boil_kettle':
        return '🔥';
      case 'fermenter':
        return '🍺';
      case 'brite_tank':
        return '✨';
      default:
        return '⚗️';
    }
  };

  const handleElementToggle = () => {
    if (heatingElement) {
      const device = state.devices.find(d => 
        d.equipment.some(e => e.id === heatingElement.id)
      );
      if (device) {
        dispatch({
          type: 'TOGGLE_EQUIPMENT',
          payload: { equipmentId: heatingElement.id, deviceId: device.id }
        });
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative"
      style={{ 
        left: vessel.position.x, 
        top: vessel.position.y,
        position: 'absolute'
      }}
    >
      {/* Recipiente Principal */}
      <div className="relative w-48 h-64 bg-gray-300 dark:bg-gray-600 rounded-lg border-4 border-gray-400 dark:border-gray-500 overflow-hidden shadow-lg">
        
        {/* Líquido */}
        <motion.div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${getLiquidColor()} opacity-80`}
          initial={{ height: 0 }}
          animate={{ height: `${fillPercentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />

        {/* Burbujas de fermentación (solo para fermentadores) */}
        {vessel.type === 'fermenter' && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white rounded-full opacity-60"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  bottom: `${10 + Math.random() * fillPercentage * 0.8}%`
                }}
                animate={{
                  y: [-10, -30, -10],
                  opacity: [0.6, 0.3, 0.6]
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              />
            ))}
          </div>
        )}

        {/* Vapor (para hervidor) */}
        {vessel.type === 'boil_kettle' && vessel.temperature.current > 95 && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-4 h-4 bg-white rounded-full opacity-40"
                style={{ left: `${i * 8 - 8}px` }}
                animate={{
                  y: [0, -20],
                  opacity: [0.4, 0],
                  scale: [0.5, 1.2]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.3
                }}
              />
            ))}
          </div>
        )}

        {/* Información del recipiente */}
        <div className="absolute top-2 left-2 right-2">
          <div className="bg-black bg-opacity-50 text-white p-2 rounded text-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold flex items-center">
                <span className="mr-1">{getVesselIcon()}</span>
                {vessel.name}
              </span>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded hover:bg-opacity-30 transition-colors"
              >
                {showDetails ? 'Ocultar' : 'Detalles'}
              </button>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Thermometer className="h-3 w-3 mr-1" />
                  <span className="text-xs">Temp:</span>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm">
                    {vessel.temperature.current.toFixed(1)}°C
                  </div>
                  <div className="text-xs opacity-75">
                    → {vessel.temperature.target.toFixed(1)}°C
                  </div>
                </div>
              </div>

              {vessel.currentVolume && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Droplets className="h-3 w-3 mr-1" />
                    <span className="text-xs">Vol:</span>
                  </div>
                  <div className="font-mono text-sm">
                    {vessel.currentVolume}L / {vessel.volume}L
                  </div>
                </div>
              )}

              {heatingElement && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Zap className="h-3 w-3 mr-1" />
                    <span className="text-xs">Potencia:</span>
                  </div>
                  <div className="font-mono text-sm">
                    {heatingElement.power || 0}%
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Controles del elemento calefactor */}
        {heatingElement && (
          <div className="absolute bottom-2 right-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleElementToggle}
              className={`p-2 rounded-full shadow-lg transition-colors ${
                heatingElement.status === 'on' || heatingElement.status === 'auto'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}
            >
              <Power className="h-4 w-4" />
            </motion.button>
          </div>
        )}

        {/* Indicador de nivel */}
        <div className="absolute right-1 top-4 bottom-4 w-2 bg-gray-200 dark:bg-gray-700 rounded-full">
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-full"
            initial={{ height: 0 }}
            animate={{ height: `${fillPercentage}%` }}
            transition={{ duration: 1 }}
          />
          <div className="absolute -right-8 top-0 text-xs text-gray-600 dark:text-gray-300">
            {vessel.volume}L
          </div>
          <div className="absolute -right-8 bottom-0 text-xs text-gray-600 dark:text-gray-300">
            0L
          </div>
        </div>
      </div>

      {/* Panel de detalles expandido */}
      {showDetails && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 z-10"
        >
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
            {vessel.name} - Detalles
          </h3>
          
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-300">Tipo:</span>
                <p className="font-medium capitalize">{vessel.type.replace('_', ' ')}</p>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-300">Capacidad:</span>
                <p className="font-medium">{vessel.volume}L</p>
              </div>
            </div>

            {tempSensor && (
              <div>
                <span className="text-gray-600 dark:text-gray-300 text-sm">Estado del sensor:</span>
                <div className="flex items-center mt-1">
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    tempSensor.status === 'online' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <span className="text-sm capitalize">{tempSensor.status}</span>
                  <span className="text-xs text-gray-500 ml-2">
                    {tempSensor.lastUpdate.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            )}

            {heatingElement && (
              <div>
                <span className="text-gray-600 dark:text-gray-300 text-sm">Control de temperatura:</span>
                <div className="mt-1 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Modo:</span>
                    <span className="capitalize">{heatingElement.controlMode}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Estado:</span>
                    <span className={`capitalize ${
                      heatingElement.status === 'on' ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      {heatingElement.status}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowDetails(false)}
              className="w-full mt-3 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
            >
              Cerrar detalles
            </button>
          </div>
        </motion.div>
      )}

      {/* Conexiones (tuberías) */}
      {showConnections && vessel.connections.map((connection, index) => {
        const targetVessel = state.vessels.find(v => v.id === connection.vesselId);
        if (!targetVessel) return null;

        return (
          <svg
            key={index}
            className="absolute pointer-events-none"
            style={{
              left: 0,
              top: 0,
              width: '100vw',
              height: '100vh',
              zIndex: -1
            }}
          >
            <line
              x1={vessel.position.x + 96} // Centro del recipiente
              y1={vessel.position.y + 132}
              x2={targetVessel.position.x + 96}
              y2={targetVessel.position.y + 132}
              stroke="#6B7280"
              strokeWidth="4"
              strokeDasharray="5,5"
            />
          </svg>
        );
      })}
    </motion.div>
  );
}