import React from 'react';
import { motion } from 'framer-motion';
import { 
  Thermometer, 
  Gauge, 
  Droplets, 
  Activity,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import { useBrewery } from '../../contexts/BreweryContext';
import { Sensor } from '../../types/brewery';

interface SensorWidgetProps {
  sensorId: string;
  title: string;
}

const getSensorIcon = (type: string) => {
  switch (type) {
    case 'temperature':
      return Thermometer;
    case 'pressure':
      return Gauge;
    case 'density':
      return Droplets;
    default:
      return Activity;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'online':
      return 'text-green-500';
    case 'offline':
      return 'text-gray-400';
    case 'error':
      return 'text-red-500';
    default:
      return 'text-gray-400';
  }
};

const getTrendIcon = (value: number, previousValue: number) => {
  if (value > previousValue) return TrendingUp;
  if (value < previousValue) return TrendingDown;
  return Minus;
};

export function SensorWidget({ sensorId, title }: SensorWidgetProps) {
  const { state } = useBrewery();
  
  const sensor = state.devices
    .flatMap(device => device.sensors)
    .find(s => s.id === sensorId);

  if (!sensor) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="text-center text-gray-500 dark:text-gray-400">
          Sensor not found
        </div>
      </div>
    );
  }

  const Icon = getSensorIcon(sensor.type);
  const statusColor = getStatusColor(sensor.status);
  
  // Simulate previous value for trend
  const previousValue = sensor.value - 0.1;
  const TrendIcon = getTrendIcon(sensor.value, previousValue);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg bg-brewery-100 dark:bg-brewery-900/20`}>
              <Icon className="h-5 w-5 text-brewery-600 dark:text-brewery-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{sensor.name}</p>
            </div>
          </div>
          <div className={`flex items-center space-x-1 ${statusColor}`}>
            <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
            <span className="text-xs font-medium capitalize">{sensor.status}</span>
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-end space-x-2">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {sensor.value.toFixed(1)}
              </span>
              <span className="text-lg text-gray-500 dark:text-gray-400 mb-1">
                {sensor.unit}
              </span>
              <TrendIcon className="h-5 w-5 text-gray-400 mb-1" />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Last update: {sensor.lastUpdate.toLocaleTimeString()}
            </p>
          </div>
        </div>

        {/* Simple gauge visualization for some sensor types */}
        {(sensor.type === 'temperature' || sensor.type === 'pressure') && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
              <span>Min</span>
              <span>Max</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-brewery-400 to-brewery-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((sensor.value / 100) * 100, 100)}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}