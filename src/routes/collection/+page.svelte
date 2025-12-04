<script>
	import DiecastCard from '$lib/components/DiecastCard.svelte';
	import { onMount } from 'svelte';

	let diecasts = $state([]);
	let loading = $state(true);
	let error = $state(null);
	let searchQuery = $state('');
	let statusFilter = $state('');
	let conditionFilter = $state('');
	let viewMode = $state('grid'); // 'grid' or 'list'

	onMount(async () => {
		await loadDiecasts();
	});

	async function loadDiecasts() {
		loading = true;
		error = null;

		try {
			let url = '/api/diecasts?limit=100';
			if (statusFilter) {
				url += `&status=${statusFilter}`;
			}
			if (conditionFilter) {
				url += `&condition=${conditionFilter}`;
			}

			const response = await fetch(url);
			const result = await response.json();

			if (!result.success) {
				throw new Error(result.error || 'Failed to load diecasts');
			}

			diecasts = result.data;
		} catch (err) {
			error = err.message || 'An error occurred';
		} finally {
			loading = false;
		}
	}

	async function handleSearch() {
		if (!searchQuery.trim()) {
			await loadDiecasts();
			return;
		}

		loading = true;
		error = null;

		try {
			let url = `/api/search?q=${encodeURIComponent(searchQuery)}`;
			if (statusFilter) {
				url += `&status=${statusFilter}`;
			}
			if (conditionFilter) {
				url += `&condition=${conditionFilter}`;
			}

			const response = await fetch(url);
			const result = await response.json();

			if (!result.success) {
				throw new Error(result.error || 'Search failed');
			}

			diecasts = result.data;
		} catch (err) {
			error = err.message || 'An error occurred';
		} finally {
			loading = false;
		}
	}

	function handleFilterChange() {
		if (searchQuery.trim()) {
			handleSearch();
		} else {
			loadDiecasts();
		}
	}

	$effect(() => {
		if (statusFilter || conditionFilter) {
			handleFilterChange();
		}
	});
</script>

<div class="min-h-screen bg-gray-50">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<!-- Header -->
		<div class="mb-6">
			<h1 class="text-3xl font-bold text-gray-900 mb-2">My Collection</h1>
			<p class="text-gray-600">{diecasts.length} diecast{diecasts.length !== 1 ? 's' : ''}</p>
		</div>

		<!-- Search and Filters -->
		<div class="bg-white rounded-lg shadow-md p-4 mb-6">
			<div class="space-y-4">
				<!-- Search -->
				<div class="flex gap-2">
					<input
						type="text"
						bind:value={searchQuery}
						onkeydown={(e) => {
							if (e.key === 'Enter') {
								handleSearch();
							}
						}}
						placeholder="Search by brand, model, or color..."
						class="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
					/>
					<button
						onclick={handleSearch}
						class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
					>
						Search
					</button>
				</div>

				<!-- Filters -->
				<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">
							Status
						</label>
						<select
							bind:value={statusFilter}
							onchange={handleFilterChange}
							class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
						>
							<option value="">All Status</option>
							<option value="pre-order">Pre-order</option>
							<option value="purchased">Purchased</option>
							<option value="in-transit">In Transit</option>
						</select>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">
							Condition
						</label>
						<select
							bind:value={conditionFilter}
							onchange={handleFilterChange}
							class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
						>
							<option value="">All Conditions</option>
							<option value="sealed">Sealed</option>
							<option value="unboxed">Unboxed</option>
						</select>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">
							View
						</label>
						<div class="flex gap-2">
							<button
								onclick={() => (viewMode = 'grid')}
								class="flex-1 px-3 py-2 border rounded-md {viewMode === 'grid'
									? 'bg-blue-600 text-white border-blue-600'
									: 'border-gray-300 text-gray-700 hover:bg-gray-50'}"
							>
								Grid
							</button>
							<button
								onclick={() => (viewMode = 'list')}
								class="flex-1 px-3 py-2 border rounded-md {viewMode === 'list'
									? 'bg-blue-600 text-white border-blue-600'
									: 'border-gray-300 text-gray-700 hover:bg-gray-50'}"
							>
								List
							</button>
						</div>
					</div>
				</div>
			</div>
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
		{:else if diecasts.length === 0}
			<div class="bg-white rounded-lg shadow p-12 text-center">
				<p class="text-gray-600 mb-4">No diecasts found.</p>
				<a
					href="/add"
					class="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
				>
					Add Your First Diecast
				</a>
			</div>
		{:else}
			{#if viewMode === 'grid'}
				<div
					class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
				>
					{#each diecasts as diecast}
						<DiecastCard {diecast} />
					{/each}
				</div>
			{:else}
				<div class="space-y-4">
					{#each diecasts as diecast}
						<a
							href="/diecast/{diecast.id}"
							class="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4"
						>
							<div class="flex gap-4">
								{#if diecast.imageUrl}
									<img
										src={diecast.imageUrl}
										alt="{diecast.brand} {diecast.model}"
										class="w-24 h-24 object-cover rounded"
									/>
								{:else}
									<div
										class="w-24 h-24 bg-gray-200 rounded flex items-center justify-center"
									>
										<svg
											class="w-8 h-8 text-gray-400"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
											/>
										</svg>
									</div>
								{/if}
								<div class="flex-1">
									<h3 class="font-semibold text-lg text-gray-900">
										{diecast.brand}
									</h3>
									<p class="text-sm text-gray-600">{diecast.model}</p>
									<div class="flex gap-2 mt-2">
										<span
											class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800"
										>
											{diecast.status.replace('-', ' ')}
										</span>
										<span
											class="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800"
										>
											{diecast.condition}
										</span>
									</div>
								</div>
							</div>
						</a>
					{/each}
				</div>
			{/if}
		{/if}
	</div>
</div>

