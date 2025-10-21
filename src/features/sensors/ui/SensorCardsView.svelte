<script lang="ts">
	import type { Sensor, SensorType } from '@entities/sensor/types';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { getSensorTypeLabel, getValueColor, getUnit } from '../lib/sensor-utils';

	interface Props {
		type: SensorType;
		sensors: Sensor[];
		onEdit?: (sensor: Sensor) => void;
		onDelete?: (sensor: Sensor) => void;
	}

	let { type, sensors, onEdit, onDelete }: Props = $props();
</script>

<div class="space-y-4">
	<div class="flex items-center gap-3">
		<div>
			<h3 class="text-2xl font-bold">{getSensorTypeLabel(type)}</h3>
			<p class="text-sm text-muted-foreground">
				{sensors.length} {sensors.length === 1 ? 'sensor' : 'sensors'}
				· Unit: {getUnit(type)}
			</p>
		</div>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
		{#each sensors as sensor (sensor.id)}
			<Card>
				<CardHeader>
					<div class="flex items-start justify-between">
						<div class="flex-1">
							<CardTitle class="text-lg">{sensor.name}</CardTitle>
						</div>
						<Badge variant={sensor.active ? 'success' : 'destructive'}>
							{sensor.active ? 'Active' : 'Inactive'}
						</Badge>
					</div>
				</CardHeader>
				<CardContent>
					<div class="space-y-3">
						<div class="flex justify-between items-baseline">
							<span class="text-sm text-muted-foreground">Value:</span>
							<span
								class={`text-2xl font-bold ${getValueColor(sensor.type, sensor.value)}`}
							>
								{sensor.value.toFixed(1)} {getUnit(sensor.type)}
							</span>
						</div>
						<div class="flex justify-between">
							<span class="text-xs text-muted-foreground">ID:</span>
							<span class="text-xs text-muted-foreground">{sensor.id}</span>
						</div>
						
						{#if onEdit || onDelete}
							<div class="flex gap-2 pt-2 border-t">
								{#if onEdit}
									<Button
										size="sm"
										variant="outline"
										class="flex-1"
										onclick={() => onEdit(sensor)}
									>
										Edit
									</Button>
								{/if}
								{#if onDelete}
									<Button
										size="sm"
										variant="outline"
										class="flex-1"
										onclick={() => onDelete(sensor)}
									>
										Delete
									</Button>
								{/if}
							</div>
						{/if}
					</div>
				</CardContent>
			</Card>
		{/each}
	</div>
</div>

