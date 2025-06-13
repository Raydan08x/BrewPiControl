import React from 'react';
import { motion } from 'framer-motion';
import { SensorWidget } from '../widgets/SensorWidget';
import { EquipmentWidget } from '../widgets/EquipmentWidget';
import { ProcessWidget } from '../widgets/ProcessWidget';
import { useBrewery } from '../../contexts/BreweryContext';

export function Dashboard() {
  const { state } = useBrewery();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Brewery Dashboard
        </h1>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium">{state.processes.filter(p => p.status === 'running').length}</span> active processes
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium">{state.devices.filter(d => d.status === 'online').length}</span> devices online
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Active Processes</p>
              <p className="text-2xl font-bold text-brewery-600 dark:text-brewery-400">
                {state.processes.filter(p => p.status === 'running').length}
              </p>
            </div>
            <div className="p-3 bg-brewery-100 dark:bg-brewery-900/20 rounded-lg">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-6 h-6 border-2 border-brewery-600 border-t-transparent rounded-full"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Online Devices</p>
              <p className="text-2xl font-bold text-green-600">
                {state.devices.filter(d => d.status === 'online').length}
              </p>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Total Sensors</p>
              <p className="text-2xl font-bold text-blue-600">
                {state.devices.reduce((acc, device) => acc + device.sensors.length, 0)}
              </p>
            </div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Alarms</p>
              <p className="text-2xl font-bold text-red-600">
                {state.alarms.filter(a => !a.acknowledged).length}
              </p>
            </div>
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          </div>
        </motion.div>
      </div>

      {/* Main Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Sensor Widgets */}
        <SensorWidget 
          sensorId="temp-001" 
          title="Mash Temperature" 
        />
        <SensorWidget 
          sensorId="density-001" 
          title="Fermentation Gravity" 
        />
        <SensorWidget 
          sensorId="temp-002" 
          title="Fermentation Temperature" 
        />

        {/* Equipment Widgets */}
        <EquipmentWidget 
          equipmentId="pump-001" 
          title="Mash Pump" 
        />

        {/* Process Widgets */}
        <ProcessWidget processId="ferment-001" />
      </div>
    </div>
  );
}