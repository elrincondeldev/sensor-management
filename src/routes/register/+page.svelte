<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { isAuthenticated } from '@features/auth/model/store';
	import RegisterForm from '@features/auth/ui/RegisterForm.svelte';
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';

	onMount(() => {
		if ($isAuthenticated) goto('/');
	});
</script>

<svelte:head>
	<title>Registrarse</title>
</svelte:head>

<div class="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
	<div class="w-full max-w-md">
		<Card>
			<CardHeader>
				<CardTitle>Crear una cuenta</CardTitle>
				<CardDescription>Ingresa tus datos para registrarte</CardDescription>
			</CardHeader>
			<CardContent>
				<RegisterForm />
			</CardContent>
		</Card>
	</div>
</div>
