<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { goto } from '$app/navigation';
	import { loginUser } from '@/shared/lib/hooks/authStorage';
	import { refreshAuth } from '../model/store';

	let email = $state('');
	let password = $state('');
	let error = $state('');

	function handleSubmit(e: Event) {
		e.preventDefault();
		error = '';

		try {
			loginUser({ email, password });
			refreshAuth();
			goto('/');
		} catch (e) {
			error = e instanceof Error ? e.message : 'Error logging in';
		}
	}
</script>

<form onsubmit={handleSubmit} class="space-y-4">
	<div class="space-y-2">
		<Label for="email">Email</Label>
		<Input id="email" type="email" placeholder="tu@email.com" bind:value={email} required />
	</div>

	<div class="space-y-2">
		<Label for="password">Password</Label>
		<Input id="password" type="password" placeholder="••••••••" bind:value={password} required />
	</div>

	{#if error}
		<div class="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
			{error}
		</div>
	{/if}

	<Button type="submit" class="w-full">Login</Button>

	<p class="text-center text-sm text-muted-foreground">
		Don't have an account? <a href="/register" class="font-medium text-primary hover:underline">Register</a>
	</p>
</form>
