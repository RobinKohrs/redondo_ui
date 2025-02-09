<script>
	import '../app.css';
	let { children } = $props();
</script>

{@render children()}

<style>
	:global(body, html) {
		margin: 0;
		background-color: #1d293b;
	}
</style>
