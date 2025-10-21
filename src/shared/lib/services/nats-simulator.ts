import { browser } from "$app/environment";
import type { Sensor } from "@entities/sensor/types";

/**
 * NATS simulator using BroadcastChannel API
 */

export type SensorMessage = {
  action: "create" | "update" | "delete";
  sensor: Sensor;
  timestamp: number;
};

class NATSSimulator {
  private channel: BroadcastChannel | null = null;
  private subscribers: Map<string, Set<(msg: SensorMessage) => void>> =
    new Map();

  constructor() {
    if (browser) {
      this.channel = new BroadcastChannel("sensor-updates");
      this.channel.onmessage = (event) => {
        this.handleMessage(event.data);
      };
    }
  }

  subscribe(
    subject: string,
    callback: (msg: SensorMessage) => void
  ): () => void {
    if (!this.subscribers.has(subject)) {
      this.subscribers.set(subject, new Set());
    }
    this.subscribers.get(subject)!.add(callback);

    // Retornar función para cancelar suscripción
    return () => {
      this.subscribers.get(subject)?.delete(callback);
    };
  }

  publish(subject: string, message: SensorMessage): void {
    if (!browser || !this.channel) {
      console.warn("NATS Simulator: BroadcastChannel not available");
      return;
    }

    const fullMessage = {
      subject,
      ...message,
    };

    this.channel.postMessage(fullMessage);

    this.handleMessage(fullMessage);
  }

  private handleMessage(data: any): void {
    const { subject, ...message } = data;
    const subscribers = this.subscribers.get(subject);

    if (subscribers) {
      subscribers.forEach((callback) => {
        callback(message as SensorMessage);
      });
    }
  }

  close(): void {
    if (this.channel) {
      this.channel.close();
      this.channel = null;
    }
    this.subscribers.clear();
  }
}

export const natsClient = new NATSSimulator();

export const SUBJECTS = {
  SENSOR_UPDATES: "sensors.updates",
  SENSOR_CREATE: "sensors.create",
  SENSOR_UPDATE: "sensors.update",
  SENSOR_DELETE: "sensors.delete",
} as const;
