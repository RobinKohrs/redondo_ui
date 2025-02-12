<script>
	import { loadIndexData } from '$lib/loadIndexData';
	import { createSearchIndex } from '$lib/createSearchIndex';
	import debounce from 'lodash.debounce';

	let { selected_regions_enriched = $bindable([]) } = $props();
	let searchQuery = $state('');
	let searchResults = $state([]);
	let showSearchResults = $state(true);
	let currentPrefix = $state('');
	let fuse = null;

	const debouncedSearch = debounce(async () => {
		if (searchQuery.length >= 2) {
			currentPrefix = searchQuery.slice(0, 2).toLowerCase();
			const data = await loadIndexData(currentPrefix);
			fuse = createSearchIndex(data);
			searchResults = fuse.search(searchQuery).slice(0, 5);
			showSearchResults = true;
		} else {
			searchResults = [];
		}
	}, 300);

	function onInput(event) {
		searchQuery = event.target.value;
		debouncedSearch();
	}

	let selected_regions = $state([]);
	$effect(() => {
		selected_regions_enriched = selected_regions.map((region) => {
			const path = `https://raw.githubusercontent.com/RobinKohrs/redondo_data/refs/heads/main/static/geodata/communes_single/${region.prefix}/${region.name_clean}.geojson`;
			return {
				...region,
				path: path
			};
		});
	});
</script>

<div class="input-container">
	<input
		type="text"
		bind:value={searchQuery}
		oninput={onInput}
		placeholder="Type at least 2 letters..."
	/>
	{#if showSearchResults}
		<div class="search-results absolute top-full mt-1 flex w-full flex-col gap-2">
			{#each searchResults as result}
				<div
					class="cursor-pointer p-1 hover:rounded-sm hover:outline hover:outline-2 hover:outline-[rebeccapurple]"
					onclick={() => {
						selected_regions.push({ prefix: currentPrefix, ...result.item });
						searchQuery = '';
						showSearchResults = false;
					}}
				>
					{result.item.name_real}
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	:global(:root) {
		--fg-color: palevioletred;
		--border-radius: 3px;
	}

	input {
		padding: 1rem;
		width: 100%;
		border-radius: var(--border-radius);
		color: rebeccapurple;
	}

	input:focus {
		outline: none;
	}

	.input-container {
		position: relative;
		margin: 3rem auto;
		width: min(80vw, 350px);
		border-radius: var(--border-radius);
		background-color: var(--bg-color);
	}

	@property --angle {
		syntax: '<angle>';
		initial-value: 0deg;
		inherits: false;
	}

	.input-container::after,
	.input-container::before {
		content: '';
		position: absolute;
		width: 100%;
		height: 100%;
		border-radius: var(--border-radius);
		background-image: conic-gradient(from var(--angle), transparent, rebeccapurple);
		xanimation: 7s spin cubic-bezier(0.1, 0.1, 0.45, 0.94) infinite;
		left: 50%;
		top: 50%;
		translate: -50% -50%;
		z-index: -1;
		xpadding: 3px;
		box-sizing: content-box;
	}

	.input-container::before {
		filter: blur(2rem);
	}

	@keyframes spin {
		from {
			--angle: 0deg;
		}

		to {
			--angle: 360deg;
		}
	}
</style>
