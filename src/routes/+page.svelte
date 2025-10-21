<script lang="ts">
	import { onMount } from 'svelte';
	import { authStore, isAuthenticated } from '@features/auth/model/store';
	import SensorsTable from '@features/sensors/ui/SensorsTable.svelte';
	import { initializeSensorsStore } from '@features/sensors/model/store';

	onMount(() => {
		initializeSensorsStore();
	});
</script>

<svelte:head>
	<title>Sensor Management</title>
</svelte:head>

<div class="container mx-auto px-4 py-12">
	{#if $isAuthenticated && $authStore}
		<div class="mb-8">
			<h1 class="text-4xl font-bold mb-2">Sensor Management</h1>
			<p class="text-muted-foreground">
				View and manage all system sensors
			</p>
		</div>
	
		<SensorsTable />
	{:else}
		<div class="max-w-2xl mx-auto text-center space-y-6">
			<h1 class="text-4xl font-bold">You are not authenticated</h1>
		</div>
	{/if}
</div>
