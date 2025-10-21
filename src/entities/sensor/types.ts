export type SensorType = 
  | "temperatura" 
  | "presión" 
  | "humedad" 
  | "luminosidad" 
  | "co2" 
  | "movimiento" 
  | "vibración";

export interface Sensor {
  id: string;
  nombre: string;
  tipo: SensorType;
  valor: number;
  estado: boolean;
}

