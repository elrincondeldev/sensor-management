import { writable, derived } from "svelte/store";
import { browser } from "$app/environment";
import { getCurrentUser } from "@shared/lib/hooks/localStorage";
import type { User } from "@entities/user/types";

export const authStore = writable<User | null>(
  browser ? getCurrentUser() : null
);
export const isAuthenticated = derived(authStore, ($user) => $user !== null);

export function refreshAuth() {
  authStore.set(getCurrentUser());
}
