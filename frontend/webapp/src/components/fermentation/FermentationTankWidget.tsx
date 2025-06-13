import React from 'react';
import { motion } from 'framer-motion';
import { 
  Thermometer, 
  Droplets, 
  Clock, 
  Activity,
  Settings
} from 'lucide-react';
import { useBrewery } from '../../contexts/BreweryContext';
import { Vessel } from '../../types/brewery';

interface FermentationTankWidgetProps {
  fermenter: Vessel;
  isSelected: boolean;
  onSelect: () => void;
}

export function FermentationTankWidget({ 
  fermenter, 
  isSelected, 
  onSelect 
}: FermentationTankWidgetProps) {
  const { state } = useBrewery();

  // Obtener proceso de fermentación asociado
  const fermentationProcess = state.processes.find(p => 
    p.type === 'fermentation' && p.name.includes(fermenter.name.split(' ')[1])
  );

  // Obtener sensores asociados
  const densitySensor = state.devices
    .flatMap(d => d.sensors)
    .find(s => s.type === 'density' && s.deviceId.includes('001'));

  const tempSensor = state.devices
    .flatMap(d => d.sensors)
    .find(s => s.id === fermenter.temperature.sensorId);

  // Calcular nivel de llenado
  const fillPercentage = fermenter.currentVolume ? 
    (fermenter.currentVolume / fermenter.volume) * 100 : 0;

  // Calcular ABV estimado
  const estimatedABV = densitySensor ? 
    ((1.050 - densitySensor.value) * 131.25).toFixed(1) : '0.0';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      onClick={onSelect}
      className={`cursor-pointer rounded-lg border-2 transition-all ${
        isSelected 
          ? 'border-purple-500 bg-purple-500 bg-opacity-20' 
          : 'border-gray-600 bg-black bg-opacity-40 hover:border-gray-500'
      } backdrop-blur-sm overflow-hidden`}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              fermentationProcess?.status === 'running' ? 'bg-green-500 animate-pulse' :
              fermentationProcess?.status === 'paused' ? 'bg-yellow-500' :
              'bg-gray-500'
            }`} />
            <h3 className="text-white font-semibold">{fermenter.name}</h3>
          </div>
          
          <button className="p-1 text-gray-400 hover:text-white transition-colors">
            <Settings className="h-4 w-4" />
          </button>
        </div>

        {/* Tanque visual */}
        <div className="relative mb-4">
          <div className="w-full h-32 bg-gray-700 rounded-lg border-2 border-gray-600 overflow-hidden relative">
            {/* Líquido */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-amber-600 to-yellow-500 opacity-80"
              initial={{ height: 0 }}
              animate={{ height: `${fillPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />

            {/* Burbujas de fermentación */}
            {fermentationProcess?.status === 'running' && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full opacity-60"
                    style={{
                      left: `${15 + Math.random() * 70}%`,
                      bottom: `${5 + Math.random() * fillPercentage * 0.8}%`
                    }}
                    animate={{
                      y: [-5, -15, -5],
                      opacity: [0.6, 0.2, 0.6]
                    }}
                    transition={{
                      duration: 1.5 + Math.random() * 1.5,
                      repeat: Infinity,
                      delay: Math.random() * 2
                    }}
                  />
                ))}
              </div>
            )}

            {/* Información superpuesta */}
            <div className="absolute top-2 left-2 right-2">
              <div className="bg-black bg-opacity-60 text-white p-2 rounded text-xs">
                <div className="flex justify-between">
                  <span>Vol:</span>
                  <span>{fermenter.currentVolume}L / {fermenter.volume}L</span>
                </div>
              </div>
            </div>

            {/* Indicador de nivel */}
            <div className="absolute right-1 top-2 bottom-2 w-1 bg-gray-600 rounded-full">
              <motion.div
                className="absolute bottom-0 left-0 right-0 bg-blue-400 rounded-full"
                initial={{ height: 0 }}
                animate={{ height: `${fillPercentage}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          </div>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Thermometer className="h-3 w-3 text-orange-400 mr-1" />
              <span className="text-xs text-gray-400">Temp</span>
            </div>
            <div className="text-lg font-bold text-white">
              {fermenter.temperature.current.toFixed(1)}°C
            </div>
            <div className="text-xs text-gray-400">
              → {fermenter.temperature.target.toFixed(1)}°C
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Droplets className="h-3 w-3 text-purple-400 mr-1" />
              <span className="text-xs text-gray-400">SG</span>
            </div>
            <div className="text-lg font-bold text-white">
              {densitySensor ? densitySensor.value.toFixed(3) : '---'}
            </div>
            <div className="text-xs text-gray-400">
              ABV: {estimatedABV}%
            </div>
          </div>
        </div>

        {/* Estado del proceso */}
        {fermentationProcess && (
          <div className="p-2 bg-gray-800 bg-opacity-50 rounded">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="h-3 w-3 text-blue-400" />
                <span className="text-gray-300">
                  Día {Math.floor((Date.now() - (fermentationProcess.startTime?.getTime() || Date.now())) / (1000 * 60 * 60 * 24)) + 1}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Activity className="h-3 w-3 text-green-400" />
                <span className="text-green-400 text-xs capitalize">
                  {fermentationProcess.status}
                </span>
              </div>
            </div>
            
            <div className="mt-2">
              <div className="w-full bg-gray-700 rounded-full h-1">
                <motion.div
                  className="bg-gradient-to-r from-purple-400 to-purple-600 h-1 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${fermentationProcess.progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Progreso</span>
                <span>{fermentationProcess.progress}%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}