<!-- GeoJSONLoader.svelte -->
<script>
	import { draw, fade } from 'svelte/transition';
	import { tick } from 'svelte';
	import { geoMercator, geoPath, geoAlbers } from 'd3-geo';
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

	$inspect(data);
	$effect(async () => {
		try {
			data = await loadGeoJSON(selected_region_enriched.path);

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
				path: path(f), // Add the path property
				show: f.properties.type === 'outline' ? true : false
			}));
		} catch (error) {
			console.error('Failed to load GeoJSON:', error);
		}
	});

	let shapes = [
		{
			display: 'Ol.',
			id: 'outline',
			color: 'purple',
			show: true
		},
		{
			display: 'Ci.',
			id: 'circle',
			color: 'pink',
			show: true
		},
		{
			display: 'BB.',
			id: 'bb',
			color: 'beige',
			show: false
		},
		{
			display: 'BBO.',
			id: 'oriented_bb',
			color: 'cornflowerblue',
			show: false
		}
	];
</script>

{#if !data.features}
	<div class="spinner"></div>
{:else}
	<div class="single-map">
		<div class="controls flex gap-2">
			{#each shapes as shape_control}
				<button
					style="background: {shape_control.color};"
					class="cursor-pointer rounded-sm border-black p-1">{shape_control.display}</button
				>
			{/each}
		</div>

		{#if shapes}
			<svg width={width + 20} height={height + 20} viewBox="0 0  {width} {height}">
				{#each data.features as feature}
					<g>
						<path
							class="draw-path"
							d={feature.path}
							stroke={feature.show ? 'purple' : 'transparent'}
							fill="transparent"
							stroke-width="2"
						/>
					</g>
				{/each}
			</svg>
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

	.draw-path {
		stroke-dasharray: 800; /* Adjust this based on the length of your path */
		stroke-dashoffset: 800;
		animation: draw 3s linear forwards;
	}

	@keyframes draw {
		from {
			stroke-dashoffset: 500;
		}
		to {
			stroke-dashoffset: 0;
		}
	}
</style>
