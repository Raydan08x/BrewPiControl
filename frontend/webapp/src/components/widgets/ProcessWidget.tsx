import React from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Square, 
  Clock,
  FlaskConical,
  Thermometer,
  Beaker
} from 'lucide-react';
import { useBrewery } from '../../contexts/BreweryContext';
import { Process } from '../../types/brewery';

interface ProcessWidgetProps {
  processId: string;
}

const getProcessIcon = (type: string) => {
  switch (type) {
    case 'mash':
      return Thermometer;
    case 'boil':
      return FlaskConical;
    case 'fermentation':
      return Beaker;
    default:
      return FlaskConical;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'running':
      return 'text-green-500 bg-green-100 dark:bg-green-900/20';
    case 'paused':
      return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20';
    case 'completed':
      return 'text-blue-500 bg-blue-100 dark:bg-blue-900/20';
    case 'error':
      return 'text-red-500 bg-red-100 dark:bg-red-900/20';
    default:
      return 'text-gray-500 bg-gray-100 dark:bg-gray-800';
  }
};

export function ProcessWidget({ processId }: ProcessWidgetProps) {
  const { state, dispatch } = useBrewery();
  
  const process = state.processes.find(p => p.id === processId);

  if (!process) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="text-center text-gray-500 dark:text-gray-400">
          Process not found
        </div>
      </div>
    );
  }

  const Icon = getProcessIcon(process.type);
  const statusColor = getStatusColor(process.status);

  const getElapsedTime = () => {
    if (!process.startTime) return 'Not started';
    const now = new Date();
    const elapsed = now.getTime() - process.startTime.getTime();
    const hours = Math.floor(elapsed / (1000 * 60 * 60));
    const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${statusColor}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{process.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{process.type}</p>
            </div>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
            {process.status.toUpperCase()}
          </span>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-300">Progress</span>
            <span className="font-medium text-gray-900 dark:text-white">
              Step {process.currentStep} of {process.totalSteps}
            </span>
          </div>

          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-brewery-400 to-brewery-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${process.progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{getElapsedTime()}</span>
            </div>
            <span>{process.progress}% complete</span>
          </div>

          <div className="flex space-x-2 pt-2">
            {process.status === 'running' ? (
              <button className="flex-1 flex items-center justify-center space-x-2 bg-yellow-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-yellow-600 transition-colors">
                <Pause className="h-4 w-4" />
                <span>Pause</span>
              </button>
            ) : process.status === 'paused' ? (
              <button className="flex-1 flex items-center justify-center space-x-2 bg-green-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors">
                <Play className="h-4 w-4" />
                <span>Resume</span>
              </button>
            ) : (
              <button className="flex-1 flex items-center justify-center space-x-2 bg-green-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors">
                <Play className="h-4 w-4" />
                <span>Start</span>
              </button>
            )}

            <button className="flex items-center justify-center space-x-2 bg-red-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-600 transition-colors">
              <Square className="h-4 w-4" />
              <span>Stop</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}