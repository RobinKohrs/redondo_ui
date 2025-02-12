<!-- src/routes/+page.svelte -->
<script>
	import { onMount } from 'svelte';
	import Search from '$lib/Search.svelte';
	import MiniMap from '$lib/MiniMap.svelte';

	let selected_regions_enriched = $state([]);
	$inspect(selected_regions_enriched);
</script>

<Search bind:selected_regions_enriched />
{#if selected_regions_enriched.length > 0}
	<div class="map-container">
		{#each selected_regions_enriched as region}
			<MiniMap selected_region_enriched={region} />
		{/each}
	</div>
{/if}
