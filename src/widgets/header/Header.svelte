<script lang="ts">
	import { authStore, isAuthenticated, refreshAuth } from '@features/auth/model/store';
	import { logoutUser } from '@/shared/lib/hooks/authStorage';
    import { Button } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
		refreshAuth();
	});

	function handleLogout() {
		logoutUser();
		refreshAuth();
		goto('/login');
	}
</script>

<header class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
	<div class="container flex h-16 items-center justify-between px-4 mx-auto">
		<a href="/" class="text-xl font-bold">Sensor Management</a>

		<div class="flex items-center gap-4">
			{#if $isAuthenticated && $authStore}
				<div class="hidden sm:flex items-center gap-3">
					<div class="text-right">
						<p class="text-sm font-medium">{$authStore.name} {$authStore.lastName}</p>
						<p class="text-xs text-muted-foreground">{$authStore.email}</p>
					</div>
					<div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
						<span class="text-sm font-semibold">
							{$authStore.name.charAt(0)}{$authStore.lastName.charAt(0)}
						</span>
					</div>
				</div>
				<Button variant="outline" size="sm" onclick={handleLogout}>Logout</Button>
			{:else}
				<div class="flex gap-2">
					<Button href="/login" variant="ghost" size="sm">Login</Button>
					<Button href="/register" size="sm">Register</Button>
				</div>
			{/if}
		</div>
	</div>
</header>
