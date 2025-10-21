import { browser } from "$app/environment";
import type { Sensor, SensorType } from "@entities/sensor/types";
import mockSensors from "../mock/sensors.json";
import { natsClient, SUBJECTS } from "../services/nats-simulator";

const SENSORS_STORAGE_KEY = "sensors";

export function getSensors(): Sensor[] {
  if (!browser) {
    return mockSensors as Sensor[];
  }

  try {
    const stored = localStorage.getItem(SENSORS_STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(SENSORS_STORAGE_KEY, JSON.stringify(mockSensors));
      return mockSensors as Sensor[];
    }

    return JSON.parse(stored) as Sensor[];
  } catch (error) {
    console.error("Error getting sensors:", error);
    return mockSensors as Sensor[];
  }
}

export function createSensor(sensorData: Omit<Sensor, "id">): Sensor {
  if (!browser) {
    throw new Error("Create sensor can only be executed in the browser");
  }

  const newSensor: Sensor = {
    ...sensorData,
    id: `sensor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  };

  const sensors = getSensors();
  sensors.push(newSensor);
  localStorage.setItem(SENSORS_STORAGE_KEY, JSON.stringify(sensors));

  natsClient.publish(SUBJECTS.SENSOR_UPDATES, {
    action: "create",
    sensor: newSensor,
    timestamp: Date.now(),
  });

  return newSensor;
}

export function updateSensor(
  id: string,
  updates: Partial<Omit<Sensor, "id">>
): Sensor {
  if (!browser) {
    throw new Error("updateSensor solo puede ejecutarse en el navegador");
  }

  const sensors = getSensors();
  const index = sensors.findIndex((s) => s.id === id);

  if (index === -1) {
    throw new Error(`Sensor con id ${id} no encontrado`);
  }

  const updatedSensor = { ...sensors[index], ...updates };
  sensors[index] = updatedSensor;
  localStorage.setItem(SENSORS_STORAGE_KEY, JSON.stringify(sensors));

  natsClient.publish(SUBJECTS.SENSOR_UPDATES, {
    action: "update",
    sensor: updatedSensor,
    timestamp: Date.now(),
  });

  return updatedSensor;
}

export function deleteSensor(id: string): void {
  if (!browser) {
    throw new Error("deleteSensor solo puede ejecutarse en el navegador");
  }

  const sensors = getSensors();
  const sensor = sensors.find((s) => s.id === id);

  if (!sensor) {
    throw new Error(`Sensor con id ${id} no encontrado`);
  }

  const filteredSensors = sensors.filter((s) => s.id !== id);
  localStorage.setItem(SENSORS_STORAGE_KEY, JSON.stringify(filteredSensors));

  natsClient.publish(SUBJECTS.SENSOR_UPDATES, {
    action: "delete",
    sensor,
    timestamp: Date.now(),
  });
}

export function getSensorById(id: string): Sensor | undefined {
  const sensors = getSensors();
  return sensors.find((s) => s.id === id);
}

export function initializeMockSensors(): void {
  if (!browser) return;

  const stored = localStorage.getItem(SENSORS_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(SENSORS_STORAGE_KEY, JSON.stringify(mockSensors));
  }
}
