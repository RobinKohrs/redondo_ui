<script>
	import { loadIndexData } from '$lib/loadIndexData';
	import { createSearchIndex } from '$lib/createSearchIndex';
	import debounce from 'lodash.debounce';

	let {selected_regions_enriched = $bindable([])} = $props()
	let searchQuery = $state('');
	let searchResults = $state([]);
	let showSearchResults = $state(true)
	let currentPrefix = $state('');
	let fuse = null;

	const debouncedSearch = debounce(async () => {
		if (searchQuery.length >= 2) {
			currentPrefix = searchQuery.slice(0, 2).toLowerCase();
			const data = await loadIndexData(currentPrefix);
			fuse = createSearchIndex(data);
			searchResults = fuse.search(searchQuery).slice(0, 5);
			showSearchResults = true
		} else {
			searchResults = [];
		}
	}, 300);

	function onInput(event) {
		searchQuery = event.target.value;
		debouncedSearch();
	}

	let selected_regions = $state([])
	$effect(() => {
		 selected_regions_enriched = selected_regions.map(region => {
			const path = `https://raw.githubusercontent.com/RobinKohrs/redondo_data/refs/heads/main/static/geodata/communes_single/${region.prefix}/${region.name_clean}.geojson`
			return {
				...region,
				path: path
			}
		})
	})
</script>

<div class="search-container relative">
	<input
		type="text"
		bind:value={searchQuery}
		oninput={onInput}
		placeholder="Type at least 2 letters..."
	/>
	<span class="bottom-glow"></span>
	{#if showSearchResults}
	<div class="search-results absolute top-full mt-1 flex flex-col gap-2 w-full">
		{#each searchResults as result}
			<div class="cursor-pointer hover:outline-red-200 hover:outline p-1" onclick={() => {
				selected_regions.push({prefix: currentPrefix, ...result.item})
				searchQuery=""
				showSearchResults = false
			}} >{result.item.name_real}</div>
		{/each}
	</div>
	{/if}
</div>

<style>
	:global(:root) {
		--fg-color: palevioletred;
	}

	input {
		border: 1px solid var(-fg-color);
		color: var(--fg-color);
		letter-spacing: 4px;
		font-size: 1.2rem;
		transition: all 0.2s;
	}
	input:focus {
		outline: none;
	}

	input:focus ~ .bottom-glow {
		display: block;
		-webkit-box-shadow: 0px 0px 105px 10px var(--fg-color);
		-moz-box-shadow: 0px 0px 105px 45px var(--fg-color);
		box-shadow: 0px 0px 105px 45px var(var(--fg-color));
	}

	.search-results {
		color: var(--fg-color);
	}
</style>
