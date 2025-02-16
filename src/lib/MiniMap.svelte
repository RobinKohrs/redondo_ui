<!-- GeoJSONLoader.svelte -->
<script>
	import { geoMercator, geoPath, geoAlbers } from 'd3-geo';
	import { draw } from 'svelte/transition';
	let { selected_region_enriched } = $props();

	let geojsonData = $state(); // Array to store fetched GeoJSON data
	let isLoading = $state(true); // Loading state
	let width = $state(200);
	let height = $state(200);
	const padding = 20; // Adjust as needed

	// Function that returns a Promise
	async function loadGeoJSON(path) {
		isLoading = true; // Set loading state at start

		try {
			const response = await fetch(path);
			if (!response.ok) throw new Error(`Failed to fetch ${path}`);

			let _data = await response.json();

			return _data; // ✅ Return the fetched GeoJSON data
		} catch (error) {
			console.error('Error loading GeoJSON data:', error);
			throw error; // ✅ Propagate error if needed
		} finally {
			isLoading = false; // Update loading state
		}
	}

	let data = $state([]);
	let projection = $state();
	let path = $state();

	$effect(async () => {
		try {
			data = await loadGeoJSON(selected_region_enriched.path);

			console.log(width, height);
			let featureToFitTo = data.features.find((f) => f.properties.type === 'circle');
			projection = geoMercator().fitExtent(
				[
					[padding, padding], // Top-left corner (minX, minY)
					[width - padding, height - padding] // Bottom-right corner (maxX, maxY)
				],
				featureToFitTo
			);
			path = geoPath().projection(projection);

			// Extract the features
			data.features = data.features.map((f) => ({
				...f, // Keep existing feature properties
				path: path(f) // Add the path property
			}));
		} catch (error) {
			console.error('Failed to load GeoJSON:', error);
		}
	});
</script>

{#if !data.features}
	<div class="spinner"></div>
{:else}
	<!-- draw the map here -->
	<div class="single-map">
		{#if data.features[0].path}
			{#each data.features as feature}
				<svg width={width + 20} height={height + 20} viewBox="0 0  {width} {height}">
					<g>
						<path
							in:draw={{ delay: 1000, duration: 1000 }}
							out:draw={{ duration: 500 }}
							d={feature.path}
							stroke="black"
							fill="transparent"
							stroke-width="2"
						/>
					</g>
				</svg>
			{/each}
		{/if}
	</div>
{/if}

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
