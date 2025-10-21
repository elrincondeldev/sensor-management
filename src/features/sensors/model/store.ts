import { writable, derived } from "svelte/store";
import { browser } from "$app/environment";
import type { Sensor } from "@entities/sensor/types";
import type { CreateSensorData, UpdateSensorData } from "./types";
import mockSensors from "@/shared/lib/mock/sensors.json";
import { natsClient, SUBJECTS } from "@/shared/lib/services/nats-simulator";

const SENSORS_STORAGE_KEY = "sensors";

export const sensorsStore = writable<Sensor[]>([]);

export const selectedSensor = writable<Sensor | null>(null);

export const sensorsCount = derived(
  sensorsStore,
  ($sensors) => $sensors.length
);

export function initializeSensorsStore(): void {
  if (!browser) {
    sensorsStore.set(mockSensors as Sensor[]);
    return;
  }

  try {
    const stored = localStorage.getItem(SENSORS_STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(SENSORS_STORAGE_KEY, JSON.stringify(mockSensors));
      sensorsStore.set(mockSensors as Sensor[]);
    } else {
      const sensors = JSON.parse(stored) as Sensor[];
      sensorsStore.set(sensors);
    }
  } catch (error) {
    console.error("Error initializing sensors store:", error);
    sensorsStore.set(mockSensors as Sensor[]);
  }
}

function saveSensorsToStorage(sensors: Sensor[]): void {
  if (!browser) return;
  localStorage.setItem(SENSORS_STORAGE_KEY, JSON.stringify(sensors));
}

export function createSensor(data: CreateSensorData): Sensor {
  if (!browser) {
    throw new Error("createSensor can only be executed in the browser");
  }

  const newSensor: Sensor = {
    ...data,
    id: `sensor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  };

  sensorsStore.update((sensors) => {
    const updated = [...sensors, newSensor];
    saveSensorsToStorage(updated);
    return updated;
  });

  natsClient.publish(SUBJECTS.SENSOR_UPDATES, {
    action: "create",
    sensor: newSensor,
    timestamp: Date.now(),
  });

  return newSensor;
}

export function updateSensor(id: string, updates: UpdateSensorData): Sensor {
  if (!browser) {
    throw new Error("updateSensor can only be executed in the browser");
  }

  let updatedSensor: Sensor | null = null;

  sensorsStore.update((sensors) => {
    const index = sensors.findIndex((s) => s.id === id);

    if (index === -1) {
      throw new Error(`Sensor with id ${id} not found`);
    }

    updatedSensor = { ...sensors[index], ...updates };
    const updated = [...sensors];
    updated[index] = updatedSensor;

    saveSensorsToStorage(updated);
    return updated;
  });

  if (updatedSensor) {
    natsClient.publish(SUBJECTS.SENSOR_UPDATES, {
      action: "update",
      sensor: updatedSensor,
      timestamp: Date.now(),
    });
  }

  return updatedSensor!;
}

export function deleteSensor(id: string): void {
  if (!browser) {
    throw new Error("deleteSensor can only be executed in the browser");
  }

  let deletedSensor: Sensor | null = null;

  sensorsStore.update((sensors) => {
    const sensor = sensors.find((s) => s.id === id);

    if (!sensor) {
      throw new Error(`Sensor with id ${id} not found`);
    }

    deletedSensor = sensor;
    const updated = sensors.filter((s) => s.id !== id);
    saveSensorsToStorage(updated);
    return updated;
  });

  if (deletedSensor) {
    natsClient.publish(SUBJECTS.SENSOR_UPDATES, {
      action: "delete",
      sensor: deletedSensor,
      timestamp: Date.now(),
    });
  }
}

export function getSensorById(id: string): Sensor | undefined {
  let foundSensor: Sensor | undefined;
  sensorsStore.subscribe((sensors) => {
    foundSensor = sensors.find((s) => s.id === id);
  })();
  return foundSensor;
}

export function subscribeToSensorUpdates(): () => void {
  return natsClient.subscribe(SUBJECTS.SENSOR_UPDATES, (message) => {
    sensorsStore.update((sensors) => {
      switch (message.action) {
        case "create":
          if (!sensors.find((s) => s.id === message.sensor.id)) {
            return [...sensors, message.sensor];
          }
          return sensors;

        case "update":
          return sensors.map((s) =>
            s.id === message.sensor.id ? message.sensor : s
          );

        case "delete":
          return sensors.filter((s) => s.id !== message.sensor.id);

        default:
          return sensors;
      }
    });
  });
}
