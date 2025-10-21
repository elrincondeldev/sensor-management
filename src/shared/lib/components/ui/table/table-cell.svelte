<script lang="ts" module>
	import { cn, type WithElementRef } from "../../../utils.js";
	import type { HTMLTdAttributes } from "svelte/elements";

	export type TableCellProps = WithElementRef<HTMLTdAttributes>;
</script>

<script lang="ts">
	let {
		class: className,
		ref = $bindable(null),
		children,
		...restProps
	}: TableCellProps = $props();
</script>

<td
	bind:this={ref}
	class={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
	{...restProps}
>
	{@render children?.()}
</td>

