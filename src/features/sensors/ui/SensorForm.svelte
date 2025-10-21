<script lang="ts">
	import type { Sensor, SensorType } from '@entities/sensor/types';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';

	interface Props {
		sensor?: Sensor;
		onSubmit: (data: Omit<Sensor, 'id'>) => void;
		onCancel: () => void;
	}

	let { sensor, onSubmit, onCancel }: Props = $props();

	const sensorTypes: SensorType[] = [
		'temperature',
		'pressure',
		'humidity',
		'luminosity',
		'co2',
		'motion',
		'vibration',
	];

	let name = $state(sensor?.name || '');
	let type = $state<SensorType>(sensor?.type || 'temperature');
	let value = $state(sensor?.value?.toString() || '0');
	let active = $state(sensor?.active ?? true);
	let error = $state('');

	function handleSubmit(e: Event) {
		e.preventDefault();
		error = '';

		if (!name.trim()) {
			error = 'Name is required';
			return;
		}

		const valueNum = parseFloat(value);
		if (isNaN(valueNum)) {
			error = 'Value must be a valid number';
			return;
		}

		onSubmit({
			name: name.trim(),
			type,
			value: valueNum,
			active,
		});
	}
</script>

<form onsubmit={handleSubmit} class="space-y-6">
	<div class="space-y-2">
		<Label for="name">Sensor Name</Label>
		<Input
			id="name"
			type="text"
			placeholder="e.g: Temperature Sensor - Room A"
			bind:value={name}
			required
		/>
	</div>

	<div class="space-y-2">
		<Label for="type">Sensor Type</Label>
		<div class="grid grid-cols-2 gap-2">
			{#each sensorTypes as sensorType}
				<button
					type="button"
					class={`px-4 py-2 rounded-md border text-sm font-medium transition-colors ${
						type === sensorType
							? 'bg-primary text-primary-foreground border-primary'
							: 'bg-background hover:bg-accent hover:text-accent-foreground'
					}`}
					onclick={() => (type = sensorType)}
				>
					{sensorType.charAt(0).toUpperCase() + sensorType.slice(1)}
				</button>
			{/each}
		</div>
	</div>

	<div class="space-y-2">
		<Label for="value">Value</Label>
		<Input
			id="value"
			type="number"
			step="0.1"
			placeholder="e.g: 23.5"
			bind:value={value}
			required
		/>
	</div>

	<div class="flex items-center space-x-2">
		<input
			id="active"
			type="checkbox"
			bind:checked={active}
			class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
		/>
		<Label for="active" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
			Active sensor
		</Label>
	</div>

	{#if error}
		<div class="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
			{error}
		</div>
	{/if}

	<div class="flex justify-end gap-3">
		<Button type="button" variant="outline" onclick={onCancel}>
			Cancel
		</Button>
		<Button type="submit">
			{sensor ? 'Update' : 'Create'} Sensor
		</Button>
	</div>
</form>

