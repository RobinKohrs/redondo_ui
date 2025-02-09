<!-- GeoJSONLoader.svelte -->
<script>

let {selected_regions_enriched} = $props()

  let geojsonData = $state([]); // Array to store fetched GeoJSON data
  let isLoading = $state(true); // Loading state

  $effect(async () => {
    try {
      // Fetch all GeoJSON data in parallel
      const fetchPromises = selected_regions_enriched.map(region =>
        fetch(region.path).then(response => {
          if (!response.ok) throw new Error(`Failed to fetch ${url}`);
          return response.json();
        })
      );

      // Wait for all fetches to complete
      geojsonData = await Promise.all(fetchPromises);
      console.log(geojsonData);
    } catch (error) {
      console.error('Error loading GeoJSON data:', error);
    } finally {
      isLoading = false; 
    }
  });
</script>

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

{#if isLoading}
  <div class="spinner"></div>
{:else if geojsonData.length > 0}
  <!-- Render the fetched GeoJSON data -->
  {#each geojsonData as data, index}
    <div>
      <h3>GeoJSON {index + 1}</h3>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  {/each}
{:else}
  <p>No GeoJSON data loaded.</p>
{/if}