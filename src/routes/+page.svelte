<script>
	import DiecastCard from '$lib/components/DiecastCard.svelte';
	import { onMount } from 'svelte';

	let diecasts = $state([]);
	let stats = $state({
		total: 0,
		preOrder: 0,
		purchased: 0,
		inTransit: 0,
		sealed: 0,
		unboxed: 0
	});
	let loading = $state(true);
	let error = $state(null);

	onMount(async () => {
		await loadData();
	});

	async function loadData() {
		loading = true;
		error = null;

		try {
			// Fetch recent diecasts
			const response = await fetch('/api/diecasts?limit=6');
			const result = await response.json();

			if (!result.success) {
				throw new Error(result.error || 'Failed to load data');
			}

			diecasts = result.data;

			// Calculate stats
			stats.total = result.data.length;
			stats.preOrder = result.data.filter((d) => d.status === 'pre-order').length;
			stats.purchased = result.data.filter((d) => d.status === 'purchased').length;
			stats.inTransit = result.data.filter((d) => d.status === 'in-transit').length;
			stats.sealed = result.data.filter((d) => d.condition === 'sealed').length;
			stats.unboxed = result.data.filter((d) => d.condition === 'unboxed').length;
		} catch (err) {
			error = err.message || 'An error occurred';
		} finally {
			loading = false;
		}
	}
</script>

<div class="min-h-screen bg-gray-50">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<!-- Header -->
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-gray-900 mb-2">Diecast Tracker</h1>
			<p class="text-gray-600">Track your diecast collection</p>
		</div>

		{#if error}
			<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
				{error}
			</div>
		{/if}

		{#if loading}
			<div class="text-center py-12">
				<svg
					class="animate-spin h-8 w-8 text-blue-500 mx-auto"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
				>
					<circle
						class="opacity-25"
						cx="12"
						cy="12"
						r="10"
						stroke="currentColor"
						stroke-width="4"
					></circle>
					<path
						class="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					></path>
				</svg>
				<p class="mt-4 text-gray-600">Loading...</p>
			</div>
		{:else}
			<!-- Stats -->
			<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
				<div class="bg-white rounded-lg shadow p-4">
					<p class="text-sm text-gray-600 mb-1">Total</p>
					<p class="text-2xl font-bold text-gray-900">{stats.total}</p>
				</div>
				<div class="bg-white rounded-lg shadow p-4">
					<p class="text-sm text-gray-600 mb-1">Pre-order</p>
					<p class="text-2xl font-bold text-yellow-600">{stats.preOrder}</p>
				</div>
				<div class="bg-white rounded-lg shadow p-4">
					<p class="text-sm text-gray-600 mb-1">Purchased</p>
					<p class="text-2xl font-bold text-green-600">{stats.purchased}</p>
				</div>
				<div class="bg-white rounded-lg shadow p-4">
					<p class="text-sm text-gray-600 mb-1">In Transit</p>
					<p class="text-2xl font-bold text-blue-600">{stats.inTransit}</p>
				</div>
				<div class="bg-white rounded-lg shadow p-4">
					<p class="text-sm text-gray-600 mb-1">Sealed</p>
					<p class="text-2xl font-bold text-gray-600">{stats.sealed}</p>
				</div>
				<div class="bg-white rounded-lg shadow p-4">
					<p class="text-sm text-gray-600 mb-1">Unboxed</p>
					<p class="text-2xl font-bold text-purple-600">{stats.unboxed}</p>
				</div>
			</div>

			<!-- Quick Actions -->
			<div class="mb-8 flex gap-4">
				<a
					href="/add"
					class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
				>
					+ Add Diecast
				</a>
				<a
					href="/collection"
					class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
				>
					View All
				</a>
			</div>

			<!-- Recent Additions -->
			<div>
				<div class="flex items-center justify-between mb-4">
					<h2 class="text-xl font-semibold text-gray-900">Recent Additions</h2>
					<a
						href="/collection"
						class="text-sm text-blue-600 hover:text-blue-700"
					>
						View all →
					</a>
				</div>

				{#if diecasts.length === 0}
					<div class="bg-white rounded-lg shadow p-12 text-center">
						<p class="text-gray-600 mb-4">No diecasts yet. Start adding to your collection!</p>
						<a
							href="/add"
							class="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
						>
							Add Your First Diecast
						</a>
					</div>
				{:else}
					<div
						class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
					>
						{#each diecasts as diecast}
							<DiecastCard {diecast} />
						{/each}
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>
