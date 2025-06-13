import React from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Thermometer, 
  Gauge, 
  Droplets, 
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw
} from 'lucide-react';
import { useBrewery } from '../../contexts/BreweryContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
    case 'offline':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    case 'error':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

// Generate sample historical data
const generateHistoricalData = (currentValue: number) => {
  const data = [];
  for (let i = 23; i >= 0; i--) {
    const time = new Date();
    time.setHours(time.getHours() - i);
    data.push({
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      value: currentValue + (Math.random() - 0.5) * 2
    });
  }
  return data;
};

export function Sensors() {
  const { state, dispatch } = useBrewery();
  
  const allSensors = state.devices.flatMap(device => 
    device.sensors.map(sensor => ({
      ...sensor,
      deviceName: device.name
    }))
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Sensor Monitoring
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Real-time sensor data and historical trends
          </p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => dispatch({ type: 'SIMULATE_DATA' })}
            className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
          <button className="flex items-center space-x-2 bg-brewery-600 text-white px-4 py-2 rounded-lg hover:bg-brewery-700 transition-colors">
            <Plus className="h-4 w-4" />
            <span>Add Sensor</span>
          </button>
        </div>
      </div>

      {/* Sensor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allSensors.map((sensor, index) => {
          const Icon = getSensorIcon(sensor.type);
          const statusColor = getStatusColor(sensor.status);
          const historicalData = generateHistoricalData(sensor.value);

          return (
            <motion.div
              key={sensor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-brewery-100 dark:bg-brewery-900/20 rounded-lg">
                      <Icon className="h-5 w-5 text-brewery-600 dark:text-brewery-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {sensor.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {sensor.deviceName}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                    {sensor.status.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="flex items-end space-x-2">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">
                          {sensor.value.toFixed(1)}
                        </span>
                        <span className="text-lg text-gray-500 dark:text-gray-400 mb-1">
                          {sensor.unit}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Last update: {sensor.lastUpdate.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  {/* Mini Chart */}
                  <div className="h-20">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={historicalData}>
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#ed7114" 
                          strokeWidth={2}
                          dot={false}
                        />
                        <Tooltip 
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-white dark:bg-gray-800 p-2 border border-gray-200 dark:border-gray-700 rounded shadow-lg">
                                  <p className="text-sm">{`${label}: ${payload[0].value?.toFixed(1)} ${sensor.unit}`}</p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-300">Type</span>
                      <p className="font-medium text-gray-900 dark:text-white capitalize">
                        {sensor.type}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-300">Device ID</span>
                      <p className="font-medium text-gray-900 dark:text-white font-mono text-xs">
                        {sensor.deviceId}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Total Sensors</p>
              <p className="text-2xl font-bold text-brewery-600 dark:text-brewery-400">
                {allSensors.length}
              </p>
            </div>
            <Activity className="h-8 w-8 text-brewery-600 dark:text-brewery-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Online</p>
              <p className="text-2xl font-bold text-green-600">
                {allSensors.filter(s => s.status === 'online').length}
              </p>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Offline</p>
              <p className="text-2xl font-bold text-gray-600">
                {allSensors.filter(s => s.status === 'offline').length}
              </p>
            </div>
            <div className="w-3 h-3 bg-gray-500 rounded-full" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Errors</p>
              <p className="text-2xl font-bold text-red-600">
                {allSensors.filter(s => s.status === 'error').length}
              </p>
            </div>
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}