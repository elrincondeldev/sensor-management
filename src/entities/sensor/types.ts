export type SensorType = 
  | "temperature" 
  | "pressure" 
  | "humidity" 
  | "luminosity" 
  | "co2" 
  | "motion" 
  | "vibration";

export interface Sensor {
  id: string;
  name: string;
  type: SensorType;
  value: number;
  active: boolean;
}

