<script lang="ts">
	import type { Sensor, SensorType } from '@entities/sensor/types';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
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
		type: SensorType;
		sensors: Sensor[];
		sortBy: 'name' | 'value' | 'active';
		sortOrder: 'asc' | 'desc';
		onSort: (column: 'name' | 'value' | 'active') => void;
		onEdit?: (sensor: Sensor) => void;
		onDelete?: (sensor: Sensor) => void;
	}

	let { type, sensors, sortBy, sortOrder, onSort, onEdit, onDelete }: Props = $props();

	function getSortIcon(column: 'name' | 'value' | 'active') {
		if (sortBy !== column) return '↕';
		return sortOrder === 'asc' ? '↑' : '↓';
	}
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

	<div class="rounded-md border">
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>
						<button
							class="flex items-center gap-1 hover:underline"
							onclick={() => onSort('name')}
						>
							Name {getSortIcon('name')}
						</button>
					</TableHead>
					<TableHead>
						<button
							class="flex items-center gap-1 hover:underline"
							onclick={() => onSort('value')}
						>
							Value {getSortIcon('value')}
						</button>
					</TableHead>
					<TableHead>
						<button
							class="flex items-center gap-1 hover:underline"
							onclick={() => onSort('active')}
						>
							Status {getSortIcon('active')}
						</button>
					</TableHead>
					<TableHead>ID</TableHead>
					<TableHead class="text-right">Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{#each sensors as sensor (sensor.id)}
					<TableRow>
						<TableCell class="font-medium min-w-[8rem] max-w-[12rem]">{sensor.name}</TableCell>
						<TableCell>
							<span class={getValueColor(sensor.type, sensor.value)}>
								{sensor.value.toFixed(1)} {getUnit(sensor.type)}
							</span>
						</TableCell>
						<TableCell>
							<Badge variant={sensor.active ? 'success' : 'destructive'}>
								{sensor.active ? 'Active' : 'Inactive'}
							</Badge>
						</TableCell>
						<TableCell class="text-muted-foreground text-xs">
							{sensor.id}
						</TableCell>
						<TableCell class="text-right">
							<div class="flex justify-end gap-2">
								{#if onEdit}
									<Button
										size="sm"
										variant="ghost"
										onclick={() => onEdit(sensor)}
									>
										Edit
									</Button>
								{/if}
								{#if onDelete}
									<Button
										size="sm"
										variant="ghost"
										onclick={() => onDelete(sensor)}
									>
										Delete
									</Button>
								{/if}
							</div>
						</TableCell>
					</TableRow>
				{/each}
			</TableBody>
		</Table>
	</div>
</div>

