<script lang="ts">
	import { authStore, isAuthenticated } from '@features/auth/model/store';
	import SensorsTable from '@features/sensors/ui/SensorsTable.svelte';
	import { getSensors } from '@shared/lib/hooks/localStorage';

	const sensors = getSensors();
</script>

<svelte:head>
	<title>Sensor Management</title>
</svelte:head>

<div class="container mx-auto px-4 py-12">
	{#if $isAuthenticated && $authStore}
	<div class="container mx-auto px-4 py-8">
		<div class="mb-8">
			<h1 class="text-4xl font-bold mb-2">Gestión de Sensores</h1>
			<p class="text-muted-foreground">
				Visualiza y administra todos los sensores del sistema
			</p>
		</div>
	
		<SensorsTable {sensors} />
	</div>
	{:else}
		<div class="max-w-2xl mx-auto text-center space-y-6">
            <h1 class="text-4xl font-bold">You are not authenticated</h1>
		</div>
	{/if}
</div>
