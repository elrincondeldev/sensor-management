import type { SensorType } from '@entities/sensor/types';

export function getSensorTypeLabel(type: SensorType): string {
	return type.charAt(0).toUpperCase() + type.slice(1);
}

export function getValueColor(type: string, value: number): string {
	switch (type) {
		case 'temperatura':
			if (value < 0) return 'text-blue-600';
			if (value > 30) return 'text-red-600';
			return 'text-green-600';
		case 'humedad':
			if (value < 30 || value > 70) return 'text-orange-600';
			return 'text-green-600';
		case 'presión':
			if (value < 95 || value > 105) return 'text-orange-600';
			return 'text-green-600';
		default:
			return 'text-foreground';
	}
}

export function getUnit(type: string): string {
	switch (type) {
		case 'temperatura':
			return '°C';
		case 'humedad':
			return '%';
		case 'presión':
			return 'kPa';
		case 'luminosidad':
			return 'lux';
		case 'co2':
			return 'ppm';
		case 'vibración':
			return 'Hz';
		default:
			return '';
	}
}

