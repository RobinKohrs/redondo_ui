<!-- GeoJSONLoader.svelte -->
<script>
	let { selected_region_enriched } = $props();

	let geojsonData = $state(); // Array to store fetched GeoJSON data
	let isLoading = $state(true); // Loading state

	try {
		const fetchProm = fetch(selected_region_enriched.path).then((response) => {
			if (!response.ok) throw new Error(`Failed to fetch ${url}`);
			geojsonData = response.json();
		});
	} catch (error) {
		console.error('Error loading GeoJSON data:', error);
	} finally {
		isLoading = false;
	}
</script>

{#await geojsonData}
	waiting
{:then geoData}
	<!-- draw the map here -->
	<div class="single-map"></div>
{/await}

<style>
	.spinner {
		border: 4px solid rgba(0, 0, 0, 0.1);
		border-top: 4px solid #3498db;
		border-radius: 50%;
		width: 40px;
		height: 40px;
		animation: spin 1s linear infinite;
		margin: 20px auto;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
