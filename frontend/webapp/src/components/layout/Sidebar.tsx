import React from 'react';
import { 
  BarChart3, 
  Gauge, 
  Zap, 
  FlaskConical, 
  Settings,
  Cpu,
  Database,
  Home,
  Flame,
  Beaker,
  Boxes
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

const menuItems = [
  { id: 'dashboard', name: 'Dashboard', icon: Home },
  { id: 'brewing', name: 'Tren de Cocción', icon: Flame },
  { id: 'fermentation', name: 'Fermentación', icon: Beaker },
  { id: 'inventory', name: 'Inventario', icon: Boxes },
  { id: 'providers', name: 'Proveedores', icon: Boxes },
  { id: 'equipment', name: 'Equipos', icon: Zap },
  { id: 'sensors', name: 'Sensores', icon: Gauge },
  { id: 'processes', name: 'Procesos', icon: FlaskConical },
  { id: 'devices', name: 'Dispositivos', icon: Cpu },
  { id: 'analytics', name: 'Análisis', icon: BarChart3 },
  { id: 'data', name: 'Datos', icon: Database },
  { id: 'settings', name: 'Configuración', icon: Settings },
];

export function Sidebar({ activeView, setActiveView }: SidebarProps) {
  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 h-full">
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all ${
                isActive
                  ? 'bg-brewery-100 dark:bg-brewery-900/20 text-brewery-700 dark:text-brewery-300 border-l-4 border-brewery-600'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.name}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}