<script lang="ts">
	import type { Sensor } from '@entities/sensor/types';
	import {
		Dialog,
		DialogContent,
		DialogDescription,
		DialogFooter,
		DialogHeader,
		DialogTitle,
	} from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';

	interface Props {
		open: boolean;
		sensor?: Sensor;
		onClose: () => void;
		onConfirm: () => void;
	}

	let { open = $bindable(false), sensor, onClose, onConfirm }: Props = $props();

	function handleOpenChange(isOpen: boolean) {
		if (!isOpen) onClose();
	}
</script>

<Dialog bind:open onOpenChange={handleOpenChange}>
	<DialogContent>
		<DialogHeader>
			<DialogTitle>Delete Sensor?</DialogTitle>
			<DialogDescription>
				The sensor will be permanently deleted.
			</DialogDescription>
		</DialogHeader>

		{#if sensor}
			<div class="py-4">
				<div class="rounded-md border p-4 space-y-2">
					<p class="font-medium">{sensor.name}</p>
					<p class="text-sm text-muted-foreground">
						Type: {sensor.type} · ID: {sensor.id}
					</p>
				</div>
			</div>
		{/if}

		<DialogFooter>
			<Button type="button" variant="outline" onclick={onClose}>
				Cancel
			</Button>
			<Button type="button" variant="destructive" onclick={onConfirm}>
				Delete
			</Button>
		</DialogFooter>
	</DialogContent>
</Dialog>

