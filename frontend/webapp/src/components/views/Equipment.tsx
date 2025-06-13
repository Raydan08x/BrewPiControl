import React from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Power, 
  Settings, 
  Activity,
  Zap,
  Droplets,
  Fan
} from 'lucide-react';
import { useBrewery } from '../../contexts/BreweryContext';

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
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
    case 'off':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    case 'auto':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
    case 'error':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

export function Equipment() {
  const { state, dispatch } = useBrewery();
  
  const allEquipment = state.devices.flatMap(device => 
    device.equipment.map(equipment => ({
      ...equipment,
      deviceName: device.name
    }))
  );

  const handleToggle = (equipmentId: string) => {
    const device = state.devices.find(d => 
      d.equipment.some(e => e.id === equipmentId)
    );
    
    if (!device) return;

    const equipment = device.equipment.find(e => e.id === equipmentId);
    if (!equipment) return;

    const updatedEquipment = {
      ...equipment,
      status: equipment.status === 'on' ? 'off' : 'on'
    };

    const updatedDevice = {
      ...device,
      equipment: device.equipment.map(e => 
        e.id === equipmentId ? updatedEquipment : e
      )
    };

    dispatch({ type: 'UPDATE_DEVICE', payload: updatedDevice });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Equipment Control
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Monitor and control brewery equipment
          </p>
        </div>
        <button className="flex items-center space-x-2 bg-brewery-600 text-white px-4 py-2 rounded-lg hover:bg-brewery-700 transition-colors">
          <Plus className="h-4 w-4" />
          <span>Add Equipment</span>
        </button>
      </div>

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allEquipment.map((equipment, index) => {
          const Icon = getEquipmentIcon(equipment.type);
          const statusColor = getStatusColor(equipment.status);

          return (
            <motion.div
              key={equipment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-brewery-100 dark:bg-brewery-900/20 rounded-lg">
                      <Icon className="h-6 w-6 text-brewery-600 dark:text-brewery-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {equipment.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {equipment.deviceName}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                    {equipment.status.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Type</span>
                    <span className="font-medium text-gray-900 dark:text-white capitalize">
                      {equipment.type}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Control Mode</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      equipment.controlMode === 'auto' 
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {equipment.controlMode.toUpperCase()}
                    </span>
                  </div>

                  {equipment.power !== undefined && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">Power</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {equipment.power}%
                      </span>
                    </div>
                  )}

                  <div className="flex space-x-2 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleToggle(equipment.id)}
                      disabled={equipment.controlMode === 'auto'}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                        equipment.status === 'on'
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'bg-green-500 text-white hover:bg-green-600'
                      } ${equipment.controlMode === 'auto' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {equipment.status === 'on' ? 'Turn Off' : 'Turn On'}
                    </motion.button>

                    <button className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <Settings className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Equipment Status Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Equipment Status Summary
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {allEquipment.filter(e => e.status === 'on').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Running</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">
              {allEquipment.filter(e => e.status === 'off').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Stopped</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {allEquipment.filter(e => e.controlMode === 'auto').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Auto Mode</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {allEquipment.filter(e => e.status === 'error').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Errors</div>
          </div>
        </div>
      </div>
    </div>
  );
}