<script>
	import favicon from '$lib/assets/favicon.svg';
	import "$lib/app.css";
	import { onMount } from 'svelte';
	import Navigation from '$lib/components/Navigation.svelte';

	let { children } = $props();

	onMount(() => {
		// Register service worker for PWA
		if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
			// Service worker will be registered by the PWA plugin
			// This is a fallback for manual registration if needed
			navigator.serviceWorker
				.register('/service-worker.js')
				.then((registration) => {
					console.log('Service Worker registered:', registration);
				})
				.catch((error) => {
					console.log('Service Worker registration failed:', error);
				});
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Navigation />
{@render children()}
