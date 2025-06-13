import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { BreweryState, Device, BrewingProcess, Vessel, PIDController, Alarm, Recipe } from '../types/brewery';
import toast from 'react-hot-toast';

interface BreweryContextType {
  state: BreweryState;
  dispatch: React.Dispatch<BreweryAction>;
}

type BreweryAction =
  | { type: 'UPDATE_DEVICE'; payload: Device }
  | { type: 'UPDATE_VESSEL'; payload: Vessel }
  | { type: 'UPDATE_PROCESS'; payload: BrewingProcess }
  | { type: 'UPDATE_PID_CONTROLLER'; payload: PIDController }
  | { type: 'ADD_ALARM'; payload: Alarm }
  | { type: 'ACKNOWLEDGE_ALARM'; payload: string }
  | { type: 'SET_MQTT_STATUS'; payload: boolean }
  | { type: 'START_PROCESS'; payload: { processId: string; recipeId?: string } }
  | { type: 'PAUSE_PROCESS'; payload: string }
  | { type: 'STOP_PROCESS'; payload: string }
  | { type: 'SIMULATE_DATA' }
  | { type: 'TOGGLE_EQUIPMENT'; payload: { equipmentId: string; deviceId: string } }
  | { type: 'SET_PID_SETPOINT'; payload: { controllerId: string; setpoint: number } }
  | { type: 'TOGGLE_PID'; payload: string };

const BreweryContext = createContext<BreweryContextType | undefined>(undefined);

// Estado inicial con datos de ejemplo
const initialState: BreweryState = {
  devices: [
    {
      id: 'esp32-mash',
      name: 'Controlador Macerador',
      type: 'esp32',
      status: 'online',
      ipAddress: '192.168.1.100',
      mqttTopic: 'brewery/mash',
      lastSeen: new Date(),
      firmwareVersion: '2.1.0',
      sensors: [
        {
          id: 'temp-mash',
          name: 'Temperatura Macerador',
          type: 'temperature',
          value: 65.5,
          unit: '°C',
          status: 'online',
          lastUpdate: new Date(),
          deviceId: 'esp32-mash',
          minValue: 0,
          maxValue: 100
        }
      ],
      equipment: [
        {
          id: 'element-mash',
          name: 'Resistencia Macerador',
          type: 'heater',
          status: 'auto',
          power: 75,
          controlMode: 'pid',
          deviceId: 'esp32-mash'
        },
        {
          id: 'pump-mash',
          name: 'Bomba Recirculación',
          type: 'pump',
          status: 'on',
          controlMode: 'manual',
          deviceId: 'esp32-mash',
          flowRate: 15
        }
      ]
    },
    {
      id: 'esp32-boil',
      name: 'Controlador Hervidor',
      type: 'esp32',
      status: 'online',
      ipAddress: '192.168.1.101',
      mqttTopic: 'brewery/boil',
      lastSeen: new Date(),
      firmwareVersion: '2.1.0',
      sensors: [
        {
          id: 'temp-boil',
          name: 'Temperatura Hervidor',
          type: 'temperature',
          value: 98.2,
          unit: '°C',
          status: 'online',
          lastUpdate: new Date(),
          deviceId: 'esp32-boil'
        }
      ],
      equipment: [
        {
          id: 'element-boil',
          name: 'Resistencia Hervidor',
          type: 'heater',
          status: 'on',
          power: 100,
          controlMode: 'manual',
          deviceId: 'esp32-boil'
        }
      ]
    },
    {
      id: 'rapt-pill-001',
      name: 'RAPT PILL Fermentador 1',
      type: 'hydrometer',
      status: 'online',
      mqttTopic: 'brewery/fermenter1/pill',
      lastSeen: new Date(),
      batteryLevel: 85,
      sensors: [
        {
          id: 'density-001',
          name: 'Gravedad Específica',
          type: 'density',
          value: 1.020,
          unit: 'SG',
          status: 'online',
          lastUpdate: new Date(),
          deviceId: 'rapt-pill-001'
        },
        {
          id: 'temp-ferment-001',
          name: 'Temperatura Fermentación',
          type: 'temperature',
          value: 20.5,
          unit: '°C',
          status: 'online',
          lastUpdate: new Date(),
          deviceId: 'rapt-pill-001'
        }
      ],
      equipment: []
    }
  ],
  vessels: [
    {
      id: 'mash-tun',
      name: 'Macerador',
      type: 'mash_tun',
      volume: 50,
      currentVolume: 35,
      temperature: {
        current: 65.5,
        target: 66.0,
        sensorId: 'temp-mash'
      },
      heatingElement: {
        equipmentId: 'element-mash',
        power: 75,
        maxPower: 100
      },
      position: { x: 100, y: 200 },
      connections: [
        { vesselId: 'boil-kettle', valveId: 'valve-mash-boil', pumpId: 'pump-transfer' }
      ]
    },
    {
      id: 'boil-kettle',
      name: 'Hervidor',
      type: 'boil_kettle',
      volume: 60,
      currentVolume: 40,
      temperature: {
        current: 98.2,
        target: 100.0,
        sensorId: 'temp-boil'
      },
      heatingElement: {
        equipmentId: 'element-boil',
        power: 100,
        maxPower: 100
      },
      position: { x: 400, y: 200 },
      connections: [
        { vesselId: 'fermenter-001', valveId: 'valve-boil-ferment' }
      ]
    },
    {
      id: 'fermenter-001',
      name: 'Fermentador 1',
      type: 'fermenter',
      volume: 50,
      currentVolume: 38,
      temperature: {
        current: 20.5,
        target: 20.0,
        sensorId: 'temp-ferment-001'
      },
      position: { x: 700, y: 200 },
      connections: []
    }
  ],
  processes: [
    {
      id: 'brew-session-001',
      name: 'IPA Session',
      type: 'mash',
      status: 'running',
      startTime: new Date(Date.now() - 45 * 60 * 1000), // Iniciado hace 45 minutos
      currentStep: 2,
      totalSteps: 5,
      progress: 40,
      currentStepStartTime: new Date(Date.now() - 15 * 60 * 1000),
      estimatedTimeRemaining: 75
    },
    {
      id: 'ferment-001',
      name: 'Fermentación IPA',
      type: 'fermentation',
      status: 'running',
      startTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // Hace 3 días
      currentStep: 1,
      totalSteps: 3,
      progress: 30
    }
  ],
  recipes: [
    {
      id: 'recipe-ipa-001',
      name: 'IPA Americana',
      style: 'American IPA',
      batchSize: 40,
      createdAt: new Date(),
      steps: [
        {
          id: 'mash-step-1',
          name: 'Maceración Sacarificación',
          type: 'mash',
          temperature: 66,
          duration: 60,
          description: 'Maceración principal a 66°C por 60 minutos',
          completed: true
        },
        {
          id: 'mash-step-2',
          name: 'Mash Out',
          type: 'mash',
          temperature: 78,
          duration: 10,
          description: 'Elevación a 78°C por 10 minutos',
          completed: false
        }
      ]
    }
  ],
  pidControllers: [
    {
      id: 'pid-mash-temp',
      name: 'Control Temperatura Macerador',
      enabled: true,
      setpoint: 66.0,
      currentValue: 65.5,
      output: 75,
      kp: 50.0,
      ki: 0.2,
      kd: 0.1,
      sensorId: 'temp-mash',
      equipmentId: 'element-mash',
      mode: 'heating'
    },
    {
      id: 'pid-ferment-temp',
      name: 'Control Temperatura Fermentador',
      enabled: true,
      setpoint: 20.0,
      currentValue: 20.5,
      output: 0,
      kp: 30.0,
      ki: 0.1,
      kd: 0.05,
      sensorId: 'temp-ferment-001',
      equipmentId: 'cooler-ferment-001',
      mode: 'cooling'
    }
  ],
  fermentationProfiles: [
    {
      id: 'profile-ale-standard',
      name: 'Ale Estándar',
      steps: [
        { temperature: 20, duration: 168, rampRate: 1 }, // 7 días a 20°C
        { temperature: 22, duration: 48, rampRate: 0.5 }, // 2 días a 22°C para diacetilo
        { temperature: 4, duration: 72, rampRate: -2 }   // 3 días a 4°C para clarificación
      ]
    }
  ],
  alarms: [
    {
      id: 'alarm-001',
      type: 'warning',
      message: 'Temperatura del macerador ligeramente por debajo del objetivo',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      acknowledged: false,
      source: 'pid-mash-temp',
      category: 'temperature'
    }
  ],
  dataLogs: [],
  mqttConnected: true,
  systemStatus: 'normal'
};

function breweryReducer(state: BreweryState, action: BreweryAction): BreweryState {
  switch (action.type) {
    case 'UPDATE_DEVICE':
      return {
        ...state,
        devices: state.devices.map(device =>
          device.id === action.payload.id ? action.payload : device
        )
      };

    case 'UPDATE_VESSEL':
      return {
        ...state,
        vessels: state.vessels.map(vessel =>
          vessel.id === action.payload.id ? action.payload : vessel
        )
      };

    case 'UPDATE_PROCESS':
      return {
        ...state,
        processes: state.processes.map(process =>
          process.id === action.payload.id ? action.payload : process
        )
      };

    case 'UPDATE_PID_CONTROLLER':
      return {
        ...state,
        pidControllers: state.pidControllers.map(controller =>
          controller.id === action.payload.id ? action.payload : controller
        )
      };

    case 'TOGGLE_EQUIPMENT': {
      const { equipmentId, deviceId } = action.payload;
      return {
        ...state,
        devices: state.devices.map(device => {
          if (device.id === deviceId) {
            return {
              ...device,
              equipment: device.equipment.map(equipment => {
                if (equipment.id === equipmentId) {
                  const newStatus = equipment.status === 'on' ? 'off' : 'on';
                  toast.success(`${equipment.name} ${newStatus === 'on' ? 'encendido' : 'apagado'}`);
                  return { ...equipment, status: newStatus };
                }
                return equipment;
              })
            };
          }
          return device;
        })
      };
    }

    case 'SET_PID_SETPOINT': {
      const { controllerId, setpoint } = action.payload;
      return {
        ...state,
        pidControllers: state.pidControllers.map(controller => {
          if (controller.id === controllerId) {
            toast.success(`Setpoint actualizado a ${setpoint}°C`);
            return { ...controller, setpoint };
          }
          return controller;
        })
      };
    }

    case 'TOGGLE_PID': {
      return {
        ...state,
        pidControllers: state.pidControllers.map(controller => {
          if (controller.id === action.payload) {
            const newEnabled = !controller.enabled;
            toast.success(`PID ${newEnabled ? 'habilitado' : 'deshabilitado'}`);
            return { ...controller, enabled: newEnabled };
          }
          return controller;
        })
      };
    }

    case 'START_PROCESS': {
      const { processId } = action.payload;
      return {
        ...state,
        processes: state.processes.map(process => {
          if (process.id === processId) {
            toast.success(`Proceso ${process.name} iniciado`);
            return {
              ...process,
              status: 'running',
              startTime: new Date(),
              currentStepStartTime: new Date()
            };
          }
          return process;
        })
      };
    }

    case 'PAUSE_PROCESS': {
      return {
        ...state,
        processes: state.processes.map(process => {
          if (process.id === action.payload) {
            toast.info(`Proceso ${process.name} pausado`);
            return { ...process, status: 'paused' };
          }
          return process;
        })
      };
    }

    case 'STOP_PROCESS': {
      return {
        ...state,
        processes: state.processes.map(process => {
          if (process.id === action.payload) {
            toast.error(`Proceso ${process.name} detenido`);
            return { ...process, status: 'idle', endTime: new Date() };
          }
          return process;
        })
      };
    }

    case 'ADD_ALARM':
      toast.error(action.payload.message);
      return {
        ...state,
        alarms: [action.payload, ...state.alarms]
      };

    case 'ACKNOWLEDGE_ALARM':
      return {
        ...state,
        alarms: state.alarms.map(alarm =>
          alarm.id === action.payload ? { ...alarm, acknowledged: true } : alarm
        )
      };

    case 'SET_MQTT_STATUS':
      if (action.payload !== state.mqttConnected) {
        toast[action.payload ? 'success' : 'error'](
          `MQTT ${action.payload ? 'conectado' : 'desconectado'}`
        );
      }
      return {
        ...state,
        mqttConnected: action.payload
      };

    case 'SIMULATE_DATA':
      return {
        ...state,
        devices: state.devices.map(device => ({
          ...device,
          sensors: device.sensors.map(sensor => ({
            ...sensor,
            value: Math.max(0, sensor.value + (Math.random() - 0.5) * 0.5),
            lastUpdate: new Date()
          }))
        })),
        vessels: state.vessels.map(vessel => ({
          ...vessel,
          temperature: {
            ...vessel.temperature,
            current: Math.max(0, vessel.temperature.current + (Math.random() - 0.5) * 0.3)
          }
        }))
      };

    default:
      return state;
  }
}

export function BreweryProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(breweryReducer, initialState);

  // Simulación de datos en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: 'SIMULATE_DATA' });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Simulación de control PID
  useEffect(() => {
    const pidInterval = setInterval(() => {
      state.pidControllers.forEach(controller => {
        if (controller.enabled) {
          const error = controller.setpoint - controller.currentValue;
          const newOutput = Math.max(0, Math.min(100, controller.output + error * 2));
          
          dispatch({
            type: 'UPDATE_PID_CONTROLLER',
            payload: { ...controller, output: newOutput }
          });
        }
      });
    }, 2000);

    return () => clearInterval(pidInterval);
  }, [state.pidControllers]);

  return (
    <BreweryContext.Provider value={{ state, dispatch }}>
      {children}
    </BreweryContext.Provider>
  );
}

export function useBrewery() {
  const context = useContext(BreweryContext);
  if (context === undefined) {
    throw new Error('useBrewery debe ser usado dentro de un BreweryProvider');
  }
  return context;
}