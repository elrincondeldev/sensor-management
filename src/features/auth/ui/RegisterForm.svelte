<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { goto } from '$app/navigation';
	import { registerUser, loginUser } from '@shared/lib/hooks/localStorage';
	import { refreshAuth } from '../model/store';

	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let name = $state('');
	let lastName = $state('');
	let error = $state('');

	function handleSubmit(e: Event) {
		e.preventDefault();
		error = '';

		if (password !== confirmPassword) {
			error = 'Las contraseñas no coinciden';
			return;
		}

		if (password.length < 6) {
			error = 'La contraseña debe tener al menos 6 caracteres';
			return;
		}

		try {
			registerUser({ email, password, name, lastName });
			loginUser({ email, password });
			refreshAuth();
			goto('/');
		} catch (e) {
			error = e instanceof Error ? e.message : 'Error al registrarse';
		}
	}
</script>

<form onsubmit={handleSubmit} class="space-y-4">
	<div class="grid grid-cols-2 gap-4">
		<div class="space-y-2">
			<Label for="name">Nombre</Label>
			<Input id="name" type="text" placeholder="Juan" bind:value={name} required />
		</div>
		<div class="space-y-2">
			<Label for="lastName">Apellido</Label>
			<Input id="lastName" type="text" placeholder="Pérez" bind:value={lastName} required />
		</div>
	</div>

	<div class="space-y-2">
		<Label for="email">Email</Label>
		<Input id="email" type="email" placeholder="tu@email.com" bind:value={email} required />
	</div>

	<div class="space-y-2">
		<Label for="password">Contraseña</Label>
		<Input id="password" type="password" placeholder="••••••••" bind:value={password} required />
	</div>

	<div class="space-y-2">
		<Label for="confirmPassword">Confirmar contraseña</Label>
		<Input id="confirmPassword" type="password" placeholder="••••••••" bind:value={confirmPassword} required />
	</div>

	{#if error}
		<div class="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
			{error}
		</div>
	{/if}

	<Button type="submit" class="w-full">Crear cuenta</Button>

	<p class="text-center text-sm text-muted-foreground">
		¿Ya tienes cuenta? <a href="/login" class="font-medium text-primary hover:underline">Inicia sesión</a>
	</p>
</form>
