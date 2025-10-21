<script lang="ts">
	import type { Sensor } from '@entities/sensor/types';
	import {
		Dialog,
		DialogContent,
		DialogDescription,
		DialogHeader,
		DialogTitle,
	} from '$lib/components/ui/dialog';
	import SensorForm from './SensorForm.svelte';

	interface Props {
		open: boolean;
		sensor?: Sensor;
		onClose: () => void;
		onSubmit: (data: Omit<Sensor, 'id'>) => void;
	}

	let { open = $bindable(false), sensor, onClose, onSubmit }: Props = $props();

	function handleOpenChange(isOpen: boolean) {
		if (!isOpen) onClose();
	}
</script>

<Dialog bind:open onOpenChange={handleOpenChange}>
	<DialogContent>
		<DialogHeader>
			<DialogTitle>
				{sensor ? 'Edit Sensor' : 'Create New Sensor'}
			</DialogTitle>
			<DialogDescription>
				{sensor
					? 'Modify the existing sensor data'
					: 'Fill out the form to add a new sensor to the system'}
			</DialogDescription>
		</DialogHeader>
		{#key sensor?.id || 'new'}
			<SensorForm sensor={sensor} onSubmit={onSubmit} onCancel={onClose} />
		{/key}
	</DialogContent>
</Dialog>

