<script lang="ts">
	import '../app.css';
	import Header from '@widgets/header/Header.svelte';
		
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href="@/assets/favicon.svg" />
</svelte:head>

<div class="min-h-screen">
	<Header />
	<main>
		{@render children?.()}
	</main>
</div>
