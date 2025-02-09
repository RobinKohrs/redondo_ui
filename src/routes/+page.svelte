<!-- src/routes/+page.svelte -->
<script>
	import { onMount } from 'svelte';
	import { loadIndexData } from '$lib/loadIndexData';
	import { createSearchIndex } from '$lib/createSearchIndex';
	import debounce from 'lodash.debounce';

	let searchQuery = $state('');
	let searchResults = $state([]);
	let oldPrefix = $state('');
	let currentPrefix = $state('');
	let fuse = null;

	const debouncedSearch = debounce(async () => {
		if (searchQuery.length >= 2) {
			currentPrefix = searchQuery.slice(0, 2).toLowerCase();
			if (currentPrefix === oldPrefix) return;
			console.log('new searchterm');
			oldPrefix = currentPrefix;
			const data = await loadIndexData(currentPrefix);
			fuse = createSearchIndex(data);
			console.log(fuse);
			searchResults = fuse.search(searchQuery).map((result) => result.item);
		} else {
			searchResults = [];
		}
	}, 300);

	function onInput(event) {
		searchQuery = event.target.value;
		debouncedSearch();
	}
</script>

<div>
	<input
		type="text"
		bind:value={searchQuery}
		on:input={onInput}
		placeholder="Type at least 2 letters..."
	/>

	<ul>
		{#each searchResults as result}
			<li>{result.name_real}</li>
		{/each}
	</ul>
</div>
