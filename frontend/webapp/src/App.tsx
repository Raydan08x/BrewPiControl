import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { BreweryProvider } from './contexts/BreweryContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Dashboard } from './components/views/Dashboard';
import { Equipment } from './components/views/Equipment';
import { Sensors } from './components/views/Sensors';
import { BrewingTrainView } from './components/brewing/BrewingTrainView';
import { FermentationView } from './components/fermentation/FermentationView';
import { Processes } from './components/views/Processes';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : true; // Por defecto modo oscuro
  });
  
  const [activeView, setActiveView] = useState('dashboard');

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'brewing':
        return <BrewingTrainView />;
      case 'fermentation':
        return <FermentationView />;
      case 'equipment':
        return <Equipment />;
      case 'sensors':
        return <Sensors />;
      case 'processes':
        return <Processes />;
      case 'devices':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Gestión de Dispositivos
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-4">
              Configuración de ESP32, MQTT y dispositivos IoT...
            </p>
          </div>
        );
      case 'analytics':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Análisis y Reportes
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-4">
              Análisis avanzado de datos de elaboración...
            </p>
          </div>
        );
      case 'data':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Registros de Datos
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-4">
              Historial y exportación de datos...
            </p>
          </div>
        );
      case 'settings':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Configuración del Sistema
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-4">
              Configuración MQTT, base de datos y sistema...
            </p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <BreweryProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: darkMode ? '#1F2937' : '#FFFFFF',
              color: darkMode ? '#F9FAFB' : '#111827',
              border: `1px solid ${darkMode ? '#374151' : '#E5E7EB'}`,
            },
          }}
        />
        
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        
        <div className="flex h-[calc(100vh-80px)]">
          <Sidebar activeView={activeView} setActiveView={setActiveView} />
          <main className="flex-1 overflow-hidden">
            {renderView()}
          </main>
        </div>
      </div>
    </BreweryProvider>
  );
}

export default App;