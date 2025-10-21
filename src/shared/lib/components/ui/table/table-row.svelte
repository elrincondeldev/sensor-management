<script lang="ts" module>
	import { cn, type WithElementRef } from "../../../utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	export type TableRowProps = WithElementRef<HTMLAttributes<HTMLTableRowElement>>;
</script>

<script lang="ts">
	let {
		class: className,
		ref = $bindable(null),
		children,
		...restProps
	}: TableRowProps = $props();
</script>

<tr
	bind:this={ref}
	class={cn(
		"border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</tr>

