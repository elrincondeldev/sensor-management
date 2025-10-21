<script lang="ts">
	import type { Sensor, SensorType } from '@entities/sensor/types';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import SensorTableView from './SensorTableView.svelte';
	import SensorCardsView from './SensorCardsView.svelte';

	interface Props {
		sensors: Sensor[];
	}

	let { sensors }: Props = $props();

	let searchTerm = $state('');
	let selectedType = $state<SensorType | 'all'>('all');
	let sortBy = $state<'nombre' | 'valor' | 'estado'>('nombre');
	let sortOrder = $state<'asc' | 'desc'>('asc');
	let viewMode = $state<'table' | 'cards'>('table');

	const uniqueTypes = $derived([
		'all',
		...new Set(sensors.map((s) => s.tipo)),
	] as const);

	const filteredSensors = $derived.by(() => {
		if (!searchTerm) return sensors;
		
		return sensors.filter((sensor) =>
			sensor.nombre.toLowerCase().includes(searchTerm.toLowerCase())
		);
	});

	const sensorsByType = $derived.by(() => {
		const groups = new Map<SensorType, Sensor[]>();
		
		filteredSensors.forEach((sensor) => {
			if (selectedType !== 'all' && sensor.tipo !== selectedType) {
				return;
			}
			
			if (!groups.has(sensor.tipo)) {
				groups.set(sensor.tipo, []);
			}
			groups.get(sensor.tipo)!.push(sensor);
		});

		groups.forEach((sensorList) => {
			sensorList.sort((a, b) => {
				const aValue = a[sortBy];
				const bValue = b[sortBy];

				if (typeof aValue === 'string' && typeof bValue === 'string') {
					return sortOrder === 'asc'
						? aValue.localeCompare(bValue)
						: bValue.localeCompare(aValue);
				}

				if (typeof aValue === 'number' && typeof bValue === 'number') {
					return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
				}

				if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
					return sortOrder === 'asc'
						? (aValue ? 1 : 0) - (bValue ? 1 : 0)
						: (bValue ? 1 : 0) - (aValue ? 1 : 0);
				}

				return 0;
			});
		});

		return groups;
	});

	const totalFiltered = $derived(
		Array.from(sensorsByType.values()).reduce((sum, list) => sum + list.length, 0)
	);

	function handleSort(column: 'nombre' | 'valor' | 'estado') {
		if (sortBy === column) {
			sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
		} else {
			sortBy = column;
			sortOrder = 'asc';
		}
	}
</script>

<div class="space-y-4">
	<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
		<div class="flex flex-col gap-4 md:flex-row md:items-center flex-1">
			<div class="flex-1 max-w-sm">
				<Input
					type="text"
					placeholder="Buscar sensores..."
					bind:value={searchTerm}
				/>
			</div>

			<div class="flex gap-2 flex-wrap">
				{#each uniqueTypes as type}
					<Button
						variant={selectedType === type ? 'default' : 'outline'}
						size="sm"
						onclick={() => (selectedType = type)}
					>
						{type === 'all' ? 'Todos' : type}
					</Button>
				{/each}
			</div>
		</div>

		<div class="flex gap-2">
			<Button
				variant={viewMode === 'table' ? 'default' : 'outline'}
				size="sm"
				onclick={() => (viewMode = 'table')}
			>
				Tabla
			</Button>
			<Button
				variant={viewMode === 'cards' ? 'default' : 'outline'}
				size="sm"
				onclick={() => (viewMode = 'cards')}
			>
				Tarjetas
			</Button>
		</div>
	</div>

	<div class="text-sm text-muted-foreground">
		Mostrando {totalFiltered} de {sensors.length} sensores
		{#if sensorsByType.size > 0}
			en {sensorsByType.size} {sensorsByType.size === 1 ? 'tipo' : 'tipos'}
		{/if}
	</div>

	{#if totalFiltered === 0}
		<div class="text-center text-muted-foreground py-12 border rounded-md">
			No se encontraron sensores
		</div>
	{:else if viewMode === 'table'}
		<div class="space-y-8">
			{#each Array.from(sensorsByType.entries()) as [tipo, sensorList] (tipo)}
				<SensorTableView
					{tipo}
					sensors={sensorList}
					{sortBy}
					{sortOrder}
					onSort={handleSort}
				/>
			{/each}
		</div>
	{:else}
		<div class="space-y-8">
			{#each Array.from(sensorsByType.entries()) as [tipo, sensorList] (tipo)}
				<SensorCardsView {tipo} sensors={sensorList} />
			{/each}
		</div>
	{/if}
</div>

