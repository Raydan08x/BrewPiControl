import React from 'react';
import { motion } from 'framer-motion';
import { 
  Power, 
  Settings, 
  Play, 
  Pause, 
  Square,
  Zap,
  Droplets,
  Fan
} from 'lucide-react';
import { useBrewery } from '../../contexts/BreweryContext';
import { Equipment } from '../../types/brewery';

interface EquipmentWidgetProps {
  equipmentId: string;
  title: string;
}

const getEquipmentIcon = (type: string) => {
  switch (type) {
    case 'pump':
      return Droplets;
    case 'heater':
      return Zap;
    case 'stirrer':
      return Fan;
    default:
      return Power;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'on':
      return 'text-green-500 bg-green-100 dark:bg-green-900/20';
    case 'off':
      return 'text-gray-500 bg-gray-100 dark:bg-gray-800';
    case 'auto':
      return 'text-blue-500 bg-blue-100 dark:bg-blue-900/20';
    case 'error':
      return 'text-red-500 bg-red-100 dark:bg-red-900/20';
    default:
      return 'text-gray-500 bg-gray-100 dark:bg-gray-800';
  }
};

export function EquipmentWidget({ equipmentId, title }: EquipmentWidgetProps) {
  const { state, dispatch } = useBrewery();
  
  const equipment = state.devices
    .flatMap(device => device.equipment)
    .find(e => e.id === equipmentId);

  if (!equipment) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="text-center text-gray-500 dark:text-gray-400">
          Equipment not found
        </div>
      </div>
    );
  }

  const Icon = getEquipmentIcon(equipment.type);
  const statusColor = getStatusColor(equipment.status);

  const handleToggle = () => {
    const device = state.devices.find(d => d.id === equipment.deviceId);
    if (!device) return;

    const updatedEquipment = {
      ...equipment,
      status: equipment.status === 'on' ? 'off' : 'on'
    } as Equipment;

    const updatedDevice = {
      ...device,
      equipment: device.equipment.map(e => 
        e.id === equipment.id ? updatedEquipment : e
      )
    };

    dispatch({ type: 'UPDATE_DEVICE', payload: updatedDevice });
  };

  const handleModeToggle = () => {
    const device = state.devices.find(d => d.id === equipment.deviceId);
    if (!device) return;

    const updatedEquipment = {
      ...equipment,
      controlMode: equipment.controlMode === 'manual' ? 'auto' : 'manual'
    } as Equipment;

    const updatedDevice = {
      ...device,
      equipment: device.equipment.map(e => 
        e.id === equipment.id ? updatedEquipment : e
      )
    };

    dispatch({ type: 'UPDATE_DEVICE', payload: updatedDevice });
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
              <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{equipment.name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
              {equipment.status.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-300">Control Mode</span>
            <button
              onClick={handleModeToggle}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                equipment.controlMode === 'auto' 
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              {equipment.controlMode.toUpperCase()}
            </button>
          </div>

          {equipment.power !== undefined && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">Power</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {equipment.power}%
              </span>
            </div>
          )}

          <div className="flex space-x-2 pt-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleToggle}
              disabled={equipment.controlMode === 'auto'}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg font-medium transition-all ${
                equipment.status === 'on'
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-green-500 text-white hover:bg-green-600'
              } ${equipment.controlMode === 'auto' ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {equipment.status === 'on' ? (
                <>
                  <Square className="h-4 w-4" />
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  <span>Start</span>
                </>
              )}
            </motion.button>

            <button className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}