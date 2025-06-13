import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Play, 
  Pause, 
  SkipForward,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useBrewery } from '../../contexts/BreweryContext';
import { BrewingProcess } from '../../types/brewery';
import { formatDistanceToNow, differenceInMinutes } from 'date-fns';
import { es } from 'date-fns/locale';

interface ProcessTimerWidgetProps {
  process: BrewingProcess;
}

export function ProcessTimerWidget({ process }: ProcessTimerWidgetProps) {
  const { state, dispatch } = useBrewery();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Actualizar el tiempo cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Obtener la receta asociada
  const recipe = state.recipes.find(r => r.id === process.recipeId);
  const currentStep = recipe?.steps[process.currentStep - 1];

  // Calcular tiempos
  const getElapsedTime = () => {
    if (!process.startTime) return 'No iniciado';
    const elapsed = differenceInMinutes(currentTime, process.startTime);
    const hours = Math.floor(elapsed / 60);
    const minutes = elapsed % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const getStepElapsedTime = () => {
    if (!process.currentStepStartTime) return 0;
    return differenceInMinutes(currentTime, process.currentStepStartTime);
  };

  const getStepRemainingTime = () => {
    if (!currentStep || !process.currentStepStartTime) return 0;
    const elapsed = getStepElapsedTime();
    return Math.max(0, currentStep.duration - elapsed);
  };

  const stepProgress = currentStep ? 
    Math.min(100, (getStepElapsedTime() / currentStep.duration) * 100) : 0;

  const handleNextStep = () => {
    // Lógica para avanzar al siguiente paso
    console.log('Avanzar al siguiente paso');
  };

  const handleToggleProcess = () => {
    if (process.status === 'running') {
      dispatch({ type: 'PAUSE_PROCESS', payload: process.id });
    } else {
      dispatch({ type: 'START_PROCESS', payload: { processId: process.id } });
    }
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
              process.status === 'running' 
                ? 'bg-green-500 bg-opacity-20 text-green-400' 
                : process.status === 'paused'
                ? 'bg-yellow-500 bg-opacity-20 text-yellow-400'
                : 'bg-gray-500 bg-opacity-20 text-gray-400'
            }`}>
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">{process.name}</h3>
              <p className="text-gray-400 text-xs">
                {recipe ? recipe.name : 'Sin receta'}
              </p>
            </div>
          </div>
          
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            process.status === 'running' 
              ? 'bg-green-500 bg-opacity-20 text-green-400'
              : process.status === 'paused'
              ? 'bg-yellow-500 bg-opacity-20 text-yellow-400'
              : 'bg-gray-500 bg-opacity-20 text-gray-400'
          }`}>
            {process.status === 'running' ? 'En curso' :
             process.status === 'paused' ? 'Pausado' :
             'Detenido'}
          </div>
        </div>
      </div>

      {/* Información del proceso */}
      <div className="p-4">
        {/* Tiempo total transcurrido */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400 text-sm">Tiempo total:</span>
            <span className="text-white font-mono text-lg">{getElapsedTime()}</span>
          </div>
          
          {/* Progreso general */}
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-brewery-400 to-brewery-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${process.progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>Paso {process.currentStep} de {process.totalSteps}</span>
            <span>{process.progress.toFixed(0)}%</span>
          </div>
        </div>

        {/* Paso actual */}
        {currentStep && (
          <div className="mb-4 p-3 bg-gray-800 bg-opacity-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  currentStep.completed ? 'bg-green-500' : 'bg-blue-500 animate-pulse'
                }`} />
                <span className="text-white font-medium text-sm">{currentStep.name}</span>
              </div>
              
              {currentStep.temperature && (
                <div className="flex items-center space-x-1 text-orange-400">
                  <span className="text-xs">🌡️</span>
                  <span className="text-sm font-mono">{currentStep.temperature}°C</span>
                </div>
              )}
            </div>

            {currentStep.description && (
              <p className="text-gray-400 text-xs mb-3">{currentStep.description}</p>
            )}

            {/* Progreso del paso actual */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Progreso del paso:</span>
                <span className="text-white font-mono">
                  {Math.floor(getStepElapsedTime())}m / {currentStep.duration}m
                </span>
              </div>
              
              <div className="w-full bg-gray-700 rounded-full h-1.5">
                <motion.div
                  className="bg-gradient-to-r from-blue-400 to-blue-600 h-1.5 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${stepProgress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              <div className="flex justify-between text-xs text-gray-400">
                <span>Tiempo restante:</span>
                <span className="font-mono">
                  {Math.floor(getStepRemainingTime())}m
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Controles */}
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleToggleProcess}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg font-medium transition-colors ${
              process.status === 'running'
                ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {process.status === 'running' ? (
              <>
                <Pause className="h-4 w-4" />
                <span>Pausar</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                <span>Reanudar</span>
              </>
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNextStep}
            disabled={process.currentStep >= process.totalSteps}
            className="flex items-center justify-center space-x-2 py-2 px-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
          >
            <SkipForward className="h-4 w-4" />
            <span>Siguiente</span>
          </motion.button>
        </div>

        {/* Alertas del paso */}
        {currentStep && getStepRemainingTime() <= 5 && getStepRemainingTime() > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 p-2 bg-yellow-500 bg-opacity-20 border border-yellow-500 rounded-lg flex items-center space-x-2"
          >
            <AlertCircle className="h-4 w-4 text-yellow-400" />
            <span className="text-yellow-400 text-sm">
              ¡Paso terminando en {Math.floor(getStepRemainingTime())} minutos!
            </span>
          </motion.div>
        )}

        {currentStep?.completed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 p-2 bg-green-500 bg-opacity-20 border border-green-500 rounded-lg flex items-center space-x-2"
          >
            <CheckCircle className="h-4 w-4 text-green-400" />
            <span className="text-green-400 text-sm">
              Paso completado
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}