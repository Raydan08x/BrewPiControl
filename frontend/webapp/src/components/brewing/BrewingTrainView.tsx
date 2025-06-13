import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Square, 
  Settings,
  Clock,
  Thermometer,
  Zap,
  Droplets,
  RotateCcw
} from 'lucide-react';
import { useBrewery } from '../../contexts/BreweryContext';
import { VesselWidget } from './VesselWidget';
import { PIDControlWidget } from './PIDControlWidget';
import { ProcessTimerWidget } from './ProcessTimerWidget';

export function BrewingTrainView() {
  const { state, dispatch } = useBrewery();
  const [showConnections, setShowConnections] = useState(true);
  const [selectedVessel, setSelectedVessel] = useState<string | null>(null);

  // Filtrar recipientes del tren de cocción
  const brewingVessels = state.vessels.filter(v => 
    v.type === 'mash_tun' || v.type === 'boil_kettle'
  );

  // Obtener proceso de cocción activo
  const activeBrewingProcess = state.processes.find(p => 
    (p.type === 'mash' || p.type === 'boil') && p.status === 'running'
  );

  // Obtener controladores PID para el tren de cocción
  const brewingPIDControllers = state.pidControllers.filter(pid =>
    brewingVessels.some(vessel => 
      vessel.temperature.sensorId === pid.sensorId
    )
  );

  return (
    <div className="h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Fondo con patrón */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255,255,255,0.2) 2px, transparent 0)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Header del tren de cocción */}
      <div className="relative z-10 p-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Tren de Cocción
            </h1>
            <p className="text-gray-300">
              Control y monitoreo del proceso de elaboración
            </p>
          </div>

          <div className="flex items-center space-x-4">
            {/* Estado del proceso */}
            {activeBrewingProcess && (
              <div className="bg-black bg-opacity-30 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    activeBrewingProcess.status === 'running' ? 'bg-green-500 animate-pulse' :
                    activeBrewingProcess.status === 'paused' ? 'bg-yellow-500' :
                    'bg-gray-500'
                  }`} />
                  <div>
                    <div className="text-white font-semibold">
                      {activeBrewingProcess.name}
                    </div>
                    <div className="text-gray-300 text-sm">
                      Paso {activeBrewingProcess.currentStep} de {activeBrewingProcess.totalSteps}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Controles */}
            <div className="flex space-x-2">
              <button
                onClick={() => setShowConnections(!showConnections)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  showConnections 
                    ? 'bg-brewery-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {showConnections ? 'Ocultar' : 'Mostrar'} Conexiones
              </button>
              
              <button className="p-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Área principal del tren de cocción */}
      <div className="relative flex-1 p-6">
        {/* Recipientes */}
        <div className="relative h-full">
          {brewingVessels.map(vessel => (
            <VesselWidget
              key={vessel.id}
              vessel={vessel}
              showConnections={showConnections}
            />
          ))}

          {/* Líneas de conexión mejoradas */}
          {showConnections && (
            <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 10 3.5, 0 7"
                    fill="#6B7280"
                  />
                </marker>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Conexión Macerador -> Hervidor */}
              <motion.path
                d="M 244 332 Q 300 280 356 332"
                stroke="#6B7280"
                strokeWidth="6"
                fill="none"
                strokeDasharray="10,5"
                markerEnd="url(#arrowhead)"
                filter="url(#glow)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
              
              {/* Etiqueta de la conexión */}
              <text
                x="300"
                y="270"
                textAnchor="middle"
                className="fill-gray-300 text-sm font-medium"
              >
                Transferencia
              </text>
            </svg>
          )}
        </div>

        {/* Panel de control lateral */}
        <div className="absolute right-6 top-6 w-80 space-y-4">
          {/* Temporizador del proceso */}
          {activeBrewingProcess && (
            <ProcessTimerWidget process={activeBrewingProcess} />
          )}

          {/* Controladores PID */}
          {brewingPIDControllers.map(controller => (
            <PIDControlWidget
              key={controller.id}
              controller={controller}
            />
          ))}

          {/* Resumen de equipos */}
          <div className="bg-black bg-opacity-40 backdrop-blur-sm rounded-lg p-4 border border-gray-600">
            <h3 className="text-white font-semibold mb-3 flex items-center">
              <Zap className="h-4 w-4 mr-2" />
              Estado de Equipos
            </h3>
            
            <div className="space-y-2">
              {state.devices
                .filter(d => d.type === 'esp32')
                .flatMap(d => d.equipment)
                .map(equipment => (
                  <div key={equipment.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">{equipment.name}</span>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        equipment.status === 'on' ? 'bg-green-500' :
                        equipment.status === 'auto' ? 'bg-blue-500' :
                        'bg-gray-500'
                      }`} />
                      <span className="text-gray-400 capitalize text-xs">
                        {equipment.status}
                      </span>
                      {equipment.power !== undefined && (
                        <span className="text-gray-400 text-xs">
                          {equipment.power}%
                        </span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Controles de proceso */}
          <div className="bg-black bg-opacity-40 backdrop-blur-sm rounded-lg p-4 border border-gray-600">
            <h3 className="text-white font-semibold mb-3 flex items-center">
              <Play className="h-4 w-4 mr-2" />
              Control de Proceso
            </h3>
            
            <div className="grid grid-cols-2 gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (activeBrewingProcess) {
                    dispatch({
                      type: activeBrewingProcess.status === 'running' ? 'PAUSE_PROCESS' : 'START_PROCESS',
                      payload: { processId: activeBrewingProcess.id }
                    });
                  }
                }}
                className={`flex items-center justify-center space-x-2 py-2 px-3 rounded-lg font-medium transition-colors ${
                  activeBrewingProcess?.status === 'running'
                    ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {activeBrewingProcess?.status === 'running' ? (
                  <>
                    <Pause className="h-4 w-4" />
                    <span>Pausar</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    <span>Iniciar</span>
                  </>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (activeBrewingProcess) {
                    dispatch({
                      type: 'STOP_PROCESS',
                      payload: activeBrewingProcess.id
                    });
                  }
                }}
                className="flex items-center justify-center space-x-2 py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                <Square className="h-4 w-4" />
                <span>Detener</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}