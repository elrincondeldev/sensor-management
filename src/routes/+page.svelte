<script lang="ts">
	import { authStore, isAuthenticated } from '@features/auth/model/store';
</script>

<svelte:head>
	<title>Sensor Management</title>
</svelte:head>

<div class="container mx-auto px-4 py-12">
	{#if $isAuthenticated && $authStore}
		<div class="max-w-2xl mx-auto text-center space-y-6">
			<h1 class="text-4xl font-bold">Bienvenido, {$authStore.name}!</h1>
		</div>
	{:else}
		<div class="max-w-2xl mx-auto text-center space-y-6">
            <h1 class="text-4xl font-bold">You are not authenticated</h1>
		</div>
	{/if}
</div>
