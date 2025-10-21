<script lang="ts">
	import type { Sensor, SensorType } from '@entities/sensor/types';
	import { Badge } from '$lib/components/ui/badge';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { getSensorTypeLabel, getValueColor, getUnit } from '../lib/sensor-utils';

	interface Props {
		tipo: SensorType;
		sensors: Sensor[];
	}

	let { tipo, sensors }: Props = $props();
</script>

<div class="space-y-4">
	<div class="flex items-center gap-3">
		<div>
			<h3 class="text-2xl font-bold">{getSensorTypeLabel(tipo)}</h3>
			<p class="text-sm text-muted-foreground">
				{sensors.length} {sensors.length === 1 ? 'sensor' : 'sensores'}
				· Unidad: {getUnit(tipo)}
			</p>
		</div>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
		{#each sensors as sensor (sensor.id)}
			<Card>
				<CardHeader>
					<div class="flex items-start justify-between">
						<div class="flex-1">
							<CardTitle class="text-lg">{sensor.nombre}</CardTitle>
						</div>
						<Badge variant={sensor.estado ? 'success' : 'destructive'}>
							{sensor.estado ? 'Activo' : 'Inactivo'}
						</Badge>
					</div>
				</CardHeader>
				<CardContent>
					<div class="space-y-2">
						<div class="flex justify-between items-baseline">
							<span class="text-sm text-muted-foreground">Valor:</span>
							<span
								class={`text-2xl font-bold ${getValueColor(sensor.tipo, sensor.valor)}`}
							>
								{sensor.valor.toFixed(1)} {getUnit(sensor.tipo)}
							</span>
						</div>
						<div class="flex justify-between">
							<span class="text-xs text-muted-foreground">ID:</span>
							<span class="text-xs text-muted-foreground">{sensor.id}</span>
						</div>
					</div>
				</CardContent>
			</Card>
		{/each}
	</div>
</div>

