<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { isAuthenticated } from '@features/auth/model/store';
	import LoginForm from '@features/auth/ui/LoginForm.svelte';
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';

	onMount(() => {
		if ($isAuthenticated) goto('/');
	});
</script>

<svelte:head>
	<title>Iniciar sesión</title>
</svelte:head>

<div class="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
	<div class="w-full max-w-md">
		<Card>
			<CardHeader>
				<CardTitle>Iniciar sesión</CardTitle>
				<CardDescription>Ingresa tu email y contraseña para acceder</CardDescription>
			</CardHeader>
			<CardContent>
				<LoginForm />
			</CardContent>
		</Card>
	</div>
</div>
