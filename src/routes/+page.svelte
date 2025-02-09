<!-- src/routes/+page.svelte -->
<script>
	import { onMount } from 'svelte';
	import Search from '$lib/Search.svelte';
	import MiniMap from '$lib/MiniMap.svelte';

	let selected_regions_enriched = $state([]);
	$inspect(selected_regions_enriched);
</script>

<div class="flex justify-center py-2">
	<Search bind:selected_regions_enriched />
	{#if selected_regions_enriched.length > 0}
		<MiniMap {selected_regions_enriched} />
	{/if}
</div>
