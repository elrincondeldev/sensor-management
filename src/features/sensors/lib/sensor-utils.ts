import type { SensorType } from '@entities/sensor/types';

export function getSensorTypeLabel(type: SensorType): string {
	return type.charAt(0).toUpperCase() + type.slice(1);
}

export function getValueColor(type: string, value: number): string {
	switch (type) {
		case 'temperature':
			if (value < 0) return 'text-blue-600';
			if (value > 30) return 'text-red-600';
			return 'text-green-600';
		case 'humidity':
			if (value < 30 || value > 70) return 'text-orange-600';
			return 'text-green-600';
		case 'pressure':
			if (value < 95 || value > 105) return 'text-orange-600';
			return 'text-green-600';
		default:
			return 'text-foreground';
	}
}

export function getUnit(type: string): string {
	switch (type) {
		case 'temperature':
			return '°C';
		case 'humidity':
			return '%';
		case 'pressure':
			return 'kPa';
		case 'luminosity':
			return 'lux';
		case 'co2':
			return 'ppm';
		case 'vibration':
			return 'Hz';
		default:
			return '';
	}
}

