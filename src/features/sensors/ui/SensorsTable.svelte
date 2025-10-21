<script lang="ts">
	import { onMount } from 'svelte';
	import type { Sensor, SensorType } from '@entities/sensor/types';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import SensorTableView from './SensorTableView.svelte';
	import SensorCardsView from './SensorCardsView.svelte';
	import SensorDialog from './SensorDialog.svelte';
	import DeleteConfirmDialog from './DeleteConfirmDialog.svelte';
	import { createSensor, updateSensor, deleteSensor } from '$lib/hooks/sensorStorage';
	import { natsClient, SUBJECTS } from '$lib/services/nats-simulator';

	interface Props {
		initialSensors: Sensor[];
	}

	let { initialSensors }: Props = $props();

	let sensors = $state<Sensor[]>(initialSensors);
	let searchTerm = $state('');
	let selectedType = $state<SensorType | 'all'>('all');
	let sortBy = $state<'name' | 'value' | 'active'>('name');
	let sortOrder = $state<'asc' | 'desc'>('asc');
	let viewMode = $state<'table' | 'cards'>('table');
	let showCreateDialog = $state(false);
	let showEditDialog = $state(false);
	let showDeleteDialog = $state(false);
	let selectedSensor = $state<Sensor | undefined>(undefined);

	const uniqueTypes = $derived([
		'all',
		...new Set(sensors.map((s) => s.type)),
	] as const);

	const filteredSensors = $derived.by(() => {
		if (!searchTerm) return sensors;
		
		return sensors.filter((sensor) =>
			sensor.name.toLowerCase().includes(searchTerm.toLowerCase())
		);
	});

	const sensorsByType = $derived.by(() => {
		const groups = new Map<SensorType, Sensor[]>();
		
		filteredSensors.forEach((sensor) => {
			if (selectedType !== 'all' && sensor.type !== selectedType) {
				return;
			}
			
			if (!groups.has(sensor.type)) {
				groups.set(sensor.type, []);
			}
			groups.get(sensor.type)!.push(sensor);
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

	function handleSort(column: 'name' | 'value' | 'active') {
		if (sortBy === column) {
			sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
		} else {
			sortBy = column;
			sortOrder = 'asc';
		}
	}
	function handleCreate(data: Omit<Sensor, 'id'>) {
		createSensor(data);
		showCreateDialog = false;
	}

	function handleEdit(sensor: Sensor) {
		selectedSensor = sensor;
		showEditDialog = true;
	}

	function handleUpdate(data: Omit<Sensor, 'id'>) {
		if (!selectedSensor) return;
		
		updateSensor(selectedSensor.id, data);
		showEditDialog = false;
		selectedSensor = undefined;
	}

	function handleDeleteClick(sensor: Sensor) {
		selectedSensor = sensor;
		showDeleteDialog = true;
	}

	function handleDeleteConfirm() {
		if (!selectedSensor) return;
		
		deleteSensor(selectedSensor.id);
		showDeleteDialog = false;
		selectedSensor = undefined;
	}
	onMount(() => {
		const unsubscribe = natsClient.subscribe(SUBJECTS.SENSOR_UPDATES, (message) => {
			switch (message.action) {
				case 'create':
					if (!sensors.find((s) => s.id === message.sensor.id)) {
						sensors = [...sensors, message.sensor];
					}
					break;
				case 'update':
					sensors = sensors.map((s) =>
						s.id === message.sensor.id ? message.sensor : s
					);
					break;
				case 'delete':
					sensors = sensors.filter((s) => s.id !== message.sensor.id);
					break;
			}
		});

		return unsubscribe;
	});
</script>

<div class="space-y-4">
	<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
		<div class="flex flex-col gap-4 md:flex-row md:items-center flex-1">
			<div class="flex-1 max-w-sm">
				<Input
					type="text"
					placeholder="Search sensors..."
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
						{type === 'all' ? 'All' : type}
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
				Table
			</Button>
			<Button
				variant={viewMode === 'cards' ? 'default' : 'outline'}
				size="sm"
				onclick={() => (viewMode = 'cards')}
			>
				Cards
			</Button>
			<Button
				variant="default"
				size="sm"
				onclick={() => (showCreateDialog = true)}
			>
				Create Sensor
			</Button>
		</div>
	</div>

	<div class="text-sm text-muted-foreground">
		Showing {totalFiltered} of {sensors.length} sensors
		{#if sensorsByType.size > 0}
			in {sensorsByType.size} {sensorsByType.size === 1 ? 'type' : 'types'}
		{/if}
	</div>

	{#if totalFiltered === 0}
		<div class="text-center text-muted-foreground py-12 border rounded-md">
			No sensors found
		</div>
	{:else if viewMode === 'table'}
		<div class="space-y-8">
			{#each Array.from(sensorsByType.entries()) as [type, sensorList] (type)}
				<SensorTableView
					{type}
					sensors={sensorList}
					{sortBy}
					{sortOrder}
					onSort={handleSort}
					onEdit={handleEdit}
					onDelete={handleDeleteClick}
				/>
			{/each}
		</div>
	{:else}
		<div class="space-y-8">
			{#each Array.from(sensorsByType.entries()) as [type, sensorList] (type)}
				<SensorCardsView
					{type}
					sensors={sensorList}
					onEdit={handleEdit}
					onDelete={handleDeleteClick}
				/>
			{/each}
		</div>
	{/if}
</div>
<SensorDialog
	bind:open={showCreateDialog}
	onClose={() => { showCreateDialog = false; }}
	onSubmit={handleCreate}
/>

<SensorDialog
	bind:open={showEditDialog}
	sensor={selectedSensor}
	onClose={() => {
		showEditDialog = false;
		selectedSensor = undefined;
	}}
	onSubmit={handleUpdate}
/>

<DeleteConfirmDialog
	bind:open={showDeleteDialog}
	sensor={selectedSensor}
	onClose={() => {
		showDeleteDialog = false;
		selectedSensor = undefined;
	}}
	onConfirm={handleDeleteConfirm}
/>

