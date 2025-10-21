import type { Sensor } from "@entities/sensor/types";

export interface CreateSensorData {
  name: string;
  type: Sensor["type"];
  value: number;
  active: boolean;
}

export interface UpdateSensorData {
  name?: string;
  type?: Sensor["type"];
  value?: number;
  active?: boolean;
}

export interface SensorMessage {
  action: "create" | "update" | "delete";
  sensor: Sensor;
  timestamp: number;
}

