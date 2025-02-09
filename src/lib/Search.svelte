<script>
	import { loadIndexData } from '$lib/loadIndexData';
	import { createSearchIndex } from '$lib/createSearchIndex';
	import debounce from 'lodash.debounce';

	let searchQuery = $state('');
	let searchResults = $state([]);
	$inspect(searchResults);
	let currentPrefix = $state('');
	let fuse = null;

	const debouncedSearch = debounce(async () => {
		if (searchQuery.length >= 2) {
			currentPrefix = searchQuery.slice(0, 2).toLowerCase();
			const data = await loadIndexData(currentPrefix);
			fuse = createSearchIndex(data);
			searchResults = fuse.search(searchQuery).slice(0, 5);
		} else {
			searchResults = [];
		}
	}, 300);

	function onInput(event) {
		searchQuery = event.target.value;
		debouncedSearch();
	}
</script>

<div class="search-container relative">
	<input
		type="text"
		bind:value={searchQuery}
		oninput={onInput}
		placeholder="Type at least 2 letters..."
	/>
	<span class="bottom-glow"></span>
	<div class="search-results absolute top-full mt-1">
		{#each searchResults as result}
			<div>{result.item.name_real}</div>
		{/each}
	</div>
</div>

<style>
	:global(:root) {
		--fg-color: palevioletred;
	}

	input {
		border: 1px solid var(-fg-color);
		color: var(--fg-color);
		letter-spacing: 2px;
		font-size: 1.5rem;
		transition: all 0.2s;
	}
	input:focus {
		letter-spacing: 5px;
		font-size: 2rem;
		outline: none;
	}

	input:focus ~ .bottom-glow {
		display: block;
		-webkit-box-shadow: 0px 0px 105px 10px var(--fg-color);
		/* -moz-box-shadow: 0px 0px 105px 45px rgba(45, 255, 196, 0.9);
		box-shadow: 0px 0px 105px 45px rgba(45, 255, 196, 0.9); */
	}

	.search-results {
		color: var(--fg-color);
	}
</style>
