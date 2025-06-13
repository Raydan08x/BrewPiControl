import React from 'react';
import { 
  Beer, 
  Settings, 
  Bell, 
  Wifi, 
  WifiOff, 
  Moon, 
  Sun,
  Activity,
  AlertTriangle
} from 'lucide-react';
import { useBrewery } from '../../contexts/BreweryContext';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export function Header({ darkMode, toggleDarkMode }: HeaderProps) {
  const { state } = useBrewery();
  const unacknowledgedAlarms = state.alarms.filter(alarm => !alarm.acknowledged);

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Beer className="h-8 w-8 text-brewery-600 dark:text-brewery-400" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              BrewPi Control
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            {state.mqttConnected ? (
              <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                <Wifi className="h-4 w-4" />
                <span className="text-sm font-medium">MQTT Connected</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1 text-red-600 dark:text-red-400">
                <WifiOff className="h-4 w-4" />
                <span className="text-sm font-medium">MQTT Disconnected</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <Activity className="h-4 w-4" />
            <span>{state.devices.filter(d => d.status === 'online').length} devices online</span>
          </div>

          {unacknowledgedAlarms.length > 0 && (
            <button className="relative p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
              <Bell className="h-5 w-5" />
              {unacknowledgedAlarms.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unacknowledgedAlarms.length}
                </span>
              )}
            </button>
          )}

          <button
            onClick={toggleDarkMode}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <button className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}