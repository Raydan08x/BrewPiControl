import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Thermometer, 
  Droplets, 
  Clock, 
  TrendingUp,
  Settings,
  BarChart3,
  AlertTriangle
} from 'lucide-react';
import { useBrewery } from '../../contexts/BreweryContext';
import { FermentationTankWidget } from './FermentationTankWidget';
import { FermentationChartWidget } from './FermentationChartWidget';
import { FermentationProfileWidget } from './FermentationProfileWidget';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Bar } from 'recharts';

export function FermentationView() {
  const { state } = useBrewery();
  const [selectedFermenter, setSelectedFermenter] = useState<string | null>(null);

  // Filtrar fermentadores
  const fermenters = state.vessels.filter(v => v.type === 'fermenter');
  
  // Obtener procesos de fermentación
  const fermentationProcesses = state.processes.filter(p => p.type === 'fermentation');
  
  // Obtener dispositivos de fermentación (RAPT PILL, etc.)
  const fermentationDevices = state.devices.filter(d => 
    d.type === 'hydrometer' || d.sensors.some(s => s.type === 'density')
  );

  // Generar datos históricos de ejemplo para gráficos
  const generateFermentationData = () => {
    const data = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 14); // 14 días atrás

    for (let i = 0; i < 14; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      // Simular curva de fermentación típica
      const initialGravity = 1.050;
      const finalGravity = 1.010;
      const progress = Math.min(1, i / 10); // Fermentación completa en ~10 días
      const currentGravity = initialGravity - (initialGravity - finalGravity) * progress;
      
      // Temperatura con variaciones
      const baseTemp = 20;
      const tempVariation = Math.sin(i * 0.5) * 1.5;
      const temperature = baseTemp + tempVariation;

      data.push({
        date: date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
        gravity: parseFloat(currentGravity.toFixed(3)),
        temperature: parseFloat(temperature.toFixed(1)),
        abv: parseFloat(((initialGravity - currentGravity) * 131.25).toFixed(1))
      });
    }
    return data;
  };

  const fermentationData = generateFermentationData();

  return (
    <div className="h-full bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Fondo con patrón */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255,255,255,0.1) 2px, transparent 0)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Header */}
      <div className="relative z-10 p-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Control de Fermentación
            </h1>
            <p className="text-gray-300">
              Monitoreo y control de procesos de fermentación
            </p>
          </div>

          <div className="flex items-center space-x-4">
            {/* Resumen de fermentadores activos */}
            <div className="bg-black bg-opacity-30 rounded-lg p-4">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {fermentationProcesses.filter(p => p.status === 'running').length}
                  </div>
                  <div className="text-xs text-gray-300">Activos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {fermenters.length}
                  </div>
                  <div className="text-xs text-gray-300">Tanques</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {fermentationDevices.length}
                  </div>
                  <div className="text-xs text-gray-300">Sensores</div>
                </div>
              </div>
            </div>

            <button className="p-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors">
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex h-full">
        {/* Panel izquierdo - Tanques de fermentación */}
        <div className="w-1/3 p-6 space-y-6 overflow-y-auto">
          <div>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Droplets className="h-5 w-5 mr-2" />
              Fermentadores
            </h2>
            
            <div className="space-y-4">
              {fermenters.map(fermenter => (
                <FermentationTankWidget
                  key={fermenter.id}
                  fermenter={fermenter}
                  isSelected={selectedFermenter === fermenter.id}
                  onSelect={() => setSelectedFermenter(fermenter.id)}
                />
              ))}
            </div>
          </div>

          {/* Dispositivos de monitoreo */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Dispositivos de Monitoreo
            </h2>
            
            <div className="space-y-3">
              {fermentationDevices.map(device => (
                <motion.div
                  key={device.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-black bg-opacity-40 backdrop-blur-sm rounded-lg p-4 border border-gray-600"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        device.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                      }`} />
                      <span className="text-white font-medium text-sm">{device.name}</span>
                    </div>
                    
                    {device.batteryLevel && (
                      <div className="flex items-center space-x-1 text-xs text-gray-400">
                        <span>🔋</span>
                        <span>{device.batteryLevel}%</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {device.sensors.map(sensor => (
                      <div key={sensor.id} className="text-center">
                        <div className="text-xs text-gray-400 mb-1">
                          {sensor.type === 'density' ? 'Gravedad' : 'Temperatura'}
                        </div>
                        <div className="text-lg font-bold text-white">
                          {sensor.value.toFixed(sensor.type === 'density' ? 3 : 1)}
                          <span className="text-xs text-gray-400 ml-1">{sensor.unit}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Panel central - Gráficos y análisis */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* Gráfico principal de fermentación */}
          <div className="bg-black bg-opacity-40 backdrop-blur-sm rounded-lg border border-gray-600 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Curva de Fermentación
              </h2>
              
              <div className="flex space-x-2">
                <button className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition-colors">
                  7 días
                </button>
                <button className="px-3 py-1 bg-gray-600 text-gray-300 text-sm rounded hover:bg-gray-500 transition-colors">
                  14 días
                </button>
                <button className="px-3 py-1 bg-gray-600 text-gray-300 text-sm rounded hover:bg-gray-500 transition-colors">
                  30 días
                </button>
              </div>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={fermentationData}>
                  <CartesianGrid strokeDasharray="3,3" stroke="#374151" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#9CA3AF"
                    fontSize={12}
                  />
                  <YAxis 
                    yAxisId="gravity"
                    orientation="left"
                    stroke="#9CA3AF"
                    fontSize={12}
                    domain={['dataMin - 0.005', 'dataMax + 0.005']}
                  />
                  <YAxis 
                    yAxisId="temp"
                    orientation="right"
                    stroke="#9CA3AF"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                  />
                  <Line
                    yAxisId="gravity"
                    type="monotone"
                    dataKey="gravity"
                    stroke="#8B5CF6"
                    strokeWidth={3}
                    dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                    name="Gravedad Específica"
                  />
                  <Line
                    yAxisId="temp"
                    type="monotone"
                    dataKey="temperature"
                    stroke="#F59E0B"
                    strokeWidth={2}
                    dot={{ fill: '#F59E0B', strokeWidth: 2, r: 3 }}
                    name="Temperatura (°C)"
                  />
                  <Bar
                    yAxisId="temp"
                    dataKey="abv"
                    fill="#10B981"
                    opacity={0.3}
                    name="ABV (%)"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Leyenda personalizada */}
            <div className="flex justify-center space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-gray-300 text-sm">Gravedad Específica</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-300 text-sm">Temperatura</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-300 text-sm">ABV</span>
              </div>
            </div>
          </div>

          {/* Métricas de fermentación */}
          <div className="grid grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black bg-opacity-40 backdrop-blur-sm rounded-lg border border-gray-600 p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Gravedad Actual</p>
                  <p className="text-2xl font-bold text-purple-400">1.020</p>
                </div>
                <Droplets className="h-8 w-8 text-purple-400" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-black bg-opacity-40 backdrop-blur-sm rounded-lg border border-gray-600 p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">ABV Estimado</p>
                  <p className="text-2xl font-bold text-green-400">5.2%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-400" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-black bg-opacity-40 backdrop-blur-sm rounded-lg border border-gray-600 p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Temperatura</p>
                  <p className="text-2xl font-bold text-yellow-400">20.5°C</p>
                </div>
                <Thermometer className="h-8 w-8 text-yellow-400" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-black bg-opacity-40 backdrop-blur-sm rounded-lg border border-gray-600 p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Días Fermentando</p>
                  <p className="text-2xl font-bold text-blue-400">7</p>
                </div>
                <Clock className="h-8 w-8 text-blue-400" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Panel derecho - Perfiles y control */}
        <div className="w-1/3 p-6 space-y-6 overflow-y-auto">
          <FermentationProfileWidget />
          
          {/* Alertas y notificaciones */}
          <div className="bg-black bg-opacity-40 backdrop-blur-sm rounded-lg border border-gray-600 p-4">
            <h3 className="text-white font-semibold mb-3 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Alertas de Fermentación
            </h3>
            
            <div className="space-y-2">
              <div className="p-2 bg-yellow-500 bg-opacity-20 border border-yellow-500 rounded text-yellow-400 text-sm">
                Temperatura ligeramente alta en Fermentador 1
              </div>
              <div className="p-2 bg-green-500 bg-opacity-20 border border-green-500 rounded text-green-400 text-sm">
                Fermentación primaria completada
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}