<script lang="ts">
	import type { Sensor, SensorType } from '@entities/sensor/types';
	import { Badge } from '$lib/components/ui/badge';
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow,
	} from '$lib/components/ui/table';
	import { getSensorTypeLabel, getValueColor, getUnit } from '../lib/sensor-utils';

	interface Props {
		tipo: SensorType;
		sensors: Sensor[];
		sortBy: 'nombre' | 'valor' | 'estado';
		sortOrder: 'asc' | 'desc';
		onSort: (column: 'nombre' | 'valor' | 'estado') => void;
	}

	let { tipo, sensors, sortBy, sortOrder, onSort }: Props = $props();

	function getSortIcon(column: 'nombre' | 'valor' | 'estado') {
		if (sortBy !== column) return '↕';
		return sortOrder === 'asc' ? '↑' : '↓';
	}
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

	<div class="rounded-md border">
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>
						<button
							class="flex items-center gap-1 hover:underline"
							onclick={() => onSort('nombre')}
						>
							Nombre {getSortIcon('nombre')}
						</button>
					</TableHead>
					<TableHead>
						<button
							class="flex items-center gap-1 hover:underline"
							onclick={() => onSort('valor')}
						>
							Valor {getSortIcon('valor')}
						</button>
					</TableHead>
					<TableHead>
						<button
							class="flex items-center gap-1 hover:underline"
							onclick={() => onSort('estado')}
						>
							Estado {getSortIcon('estado')}
						</button>
					</TableHead>
					<TableHead>ID</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{#each sensors as sensor (sensor.id)}
					<TableRow>
						<TableCell class="font-medium">{sensor.nombre}</TableCell>
						<TableCell>
							<span class={getValueColor(sensor.tipo, sensor.valor)}>
								{sensor.valor.toFixed(1)} {getUnit(sensor.tipo)}
							</span>
						</TableCell>
						<TableCell>
							<Badge variant={sensor.estado ? 'success' : 'destructive'}>
								{sensor.estado ? 'Activo' : 'Inactivo'}
							</Badge>
						</TableCell>
						<TableCell class="text-muted-foreground text-xs">
							{sensor.id}
						</TableCell>
					</TableRow>
				{/each}
			</TableBody>
		</Table>
	</div>
</div>

