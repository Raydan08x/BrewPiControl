// Tipos de datos para el sistema de control de cervecería
export interface Sensor {
  id: string;
  name: string;
  type: 'temperature' | 'pressure' | 'flow' | 'density' | 'ph' | 'level';
  value: number;
  unit: string;
  status: 'online' | 'offline' | 'error';
  lastUpdate: Date;
  deviceId: string;
  minValue?: number;
  maxValue?: number;
  calibrationOffset?: number;
}

export interface Equipment {
  id: string;
  name: string;
  type: 'pump' | 'valve' | 'heater' | 'cooler' | 'stirrer' | 'element';
  status: 'on' | 'off' | 'auto' | 'error';
  power?: number;
  controlMode: 'manual' | 'auto' | 'pid';
  deviceId: string;
  position?: { x: number; y: number };
  isOpen?: boolean; // Para válvulas
  flowRate?: number; // Para bombas
}

export interface PIDController {
  id: string;
  name: string;
  enabled: boolean;
  setpoint: number;
  currentValue: number;
  output: number;
  kp: number; // Proporcional
  ki: number; // Integral
  kd: number; // Derivativo
  sensorId: string;
  equipmentId: string;
  mode: 'heating' | 'cooling' | 'both';
}

export interface BrewingStep {
  id: string;
  name: string;
  type: 'mash' | 'sparge' | 'boil' | 'whirlpool' | 'chill';
  temperature?: number;
  duration: number; // en minutos
  description?: string;
  completed: boolean;
}

export interface Recipe {
  id: string;
  name: string;
  style: string;
  batchSize: number;
  steps: BrewingStep[];
  createdAt: Date;
  lastUsed?: Date;
}

export interface BrewingProcess {
  id: string;
  name: string;
  recipeId?: string;
  type: 'mash' | 'boil' | 'fermentation' | 'conditioning';
  status: 'idle' | 'running' | 'paused' | 'completed' | 'error';
  startTime?: Date;
  endTime?: Date;
  currentStep: number;
  totalSteps: number;
  progress: number;
  currentStepStartTime?: Date;
  estimatedTimeRemaining?: number;
}

export interface FermentationProfile {
  id: string;
  name: string;
  steps: Array<{
    temperature: number;
    duration: number; // en horas
    rampRate?: number; // °C por hora
  }>;
}

export interface Vessel {
  id: string;
  name: string;
  type: 'mash_tun' | 'boil_kettle' | 'fermenter' | 'brite_tank';
  volume: number;
  currentVolume?: number;
  temperature: {
    current: number;
    target: number;
    sensorId: string;
  };
  heatingElement?: {
    equipmentId: string;
    power: number;
    maxPower: number;
  };
  position: { x: number; y: number };
  connections: Array<{
    vesselId: string;
    valveId: string;
    pumpId?: string;
  }>;
}

export interface Device {
  id: string;
  name: string;
  type: 'esp32' | 'plc' | 'hydrometer' | 'raspberry_pi';
  status: 'online' | 'offline' | 'error';
  ipAddress?: string;
  mqttTopic: string;
  lastSeen: Date;
  sensors: Sensor[];
  equipment: Equipment[];
  firmwareVersion?: string;
  batteryLevel?: number; // Para dispositivos inalámbricos
}

export interface Alarm {
  id: string;
  type: 'warning' | 'error' | 'info' | 'critical';
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  source: string;
  category: 'temperature' | 'pressure' | 'equipment' | 'process' | 'system';
  autoAcknowledge?: boolean;
}

export interface DataLog {
  id: string;
  timestamp: Date;
  sensorId: string;
  value: number;
  processId?: string;
}

export interface BreweryState {
  devices: Device[];
  vessels: Vessel[];
  processes: BrewingProcess[];
  recipes: Recipe[];
  pidControllers: PIDController[];
  fermentationProfiles: FermentationProfile[];
  alarms: Alarm[];
  dataLogs: DataLog[];
  mqttConnected: boolean;
  systemStatus: 'normal' | 'warning' | 'error';
  currentUser?: string;
}

export interface Widget {
  id: string;
  type: 'vessel' | 'sensor' | 'equipment' | 'chart' | 'process' | 'pid' | 'alarm';
  title: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  config: Record<string, any>;
  visible: boolean;
}

export interface BrewingLayout {
  id: string;
  name: string;
  type: 'brewing' | 'fermentation' | 'packaging';
  widgets: Widget[];
  background?: string;
  gridSize: number;
}