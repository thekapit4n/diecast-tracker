<script>
	import DiecastForm from '$lib/components/DiecastForm.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	let diecast = $state(null);
	let loading = $state(true);
	let error = $state(null);
	let editing = $state(false);
	let deleting = $state(false);

	onMount(async () => {
		await loadDiecast();
	});

	async function loadDiecast() {
		loading = true;
		error = null;

		try {
			const id = $page.params.id;
			const response = await fetch(`/api/diecasts/${id}`);
			const result = await response.json();

			if (!result.success) {
				throw new Error(result.error || 'Failed to load diecast');
			}

			diecast = result.data;
		} catch (err) {
			error = err.message || 'An error occurred';
		} finally {
			loading = false;
		}
	}

	async function handleUpdate(updatedDiecast) {
		diecast = updatedDiecast;
		editing = false;
	}

	function handleCancel() {
		editing = false;
	}

	async function handleDelete() {
		if (!confirm('Are you sure you want to delete this diecast?')) {
			return;
		}

		deleting = true;
		error = null;

		try {
			const id = $page.params.id;
			const response = await fetch(`/api/diecasts/${id}`, {
				method: 'DELETE'
			});

			const result = await response.json();

			if (!result.success) {
				throw new Error(result.error || 'Failed to delete diecast');
			}

			goto('/collection');
		} catch (err) {
			error = err.message || 'An error occurred';
			deleting = false;
		}
	}

	const statusColors = {
		'pre-order': 'bg-yellow-100 text-yellow-800',
		'purchased': 'bg-green-100 text-green-800',
		'in-transit': 'bg-blue-100 text-blue-800'
	};

	const conditionColors = {
		sealed: 'bg-gray-100 text-gray-800',
		unboxed: 'bg-purple-100 text-purple-800'
	};
</script>

<div class="min-h-screen bg-gray-50">
	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
		{:else if error}
			<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
				{error}
			</div>
		{:else if diecast}
			{#if editing}
				<div class="mb-6">
					<h1 class="text-3xl font-bold text-gray-900 mb-2">Edit Diecast</h1>
				</div>
				<div class="bg-white rounded-lg shadow-md p-6">
					<DiecastForm {diecast} {onSubmit} {onCancel} />
				</div>
			{:else}
				<!-- Back button -->
				<a
					href="/collection"
					class="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
				>
					<svg
						class="w-5 h-5 mr-2"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 19l-7-7 7-7"
						/>
					</svg>
					Back to Collection
				</a>

				<!-- Diecast Details -->
				<div class="bg-white rounded-lg shadow-md overflow-hidden">
					{#if diecast.imageUrl}
						<img
							src={diecast.imageUrl}
							alt="{diecast.brand} {diecast.model}"
							class="w-full h-96 object-cover"
						/>
					{:else}
						<div class="w-full h-96 bg-gray-200 flex items-center justify-center">
							<svg
								class="w-24 h-24 text-gray-400"
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

					<div class="p-6">
						<div class="flex items-start justify-between mb-4">
							<div>
								<h1 class="text-3xl font-bold text-gray-900 mb-2">
									{diecast.brand}
								</h1>
								<p class="text-xl text-gray-600">{diecast.model}</p>
							</div>
							<div class="flex gap-2">
								<button
									onclick={() => (editing = true)}
									class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
								>
									Edit
								</button>
								<button
									onclick={handleDelete}
									disabled={deleting}
									class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
								>
									{deleting ? 'Deleting...' : 'Delete'}
								</button>
							</div>
						</div>

						<div class="flex flex-wrap gap-2 mb-6">
							<span
								class="px-3 py-1 text-sm font-medium rounded-full {statusColors[diecast.status]}"
							>
								{diecast.status.replace('-', ' ')}
							</span>
							<span
								class="px-3 py-1 text-sm font-medium rounded-full {conditionColors[diecast.condition]}"
							>
								{diecast.condition}
							</span>
						</div>

						<div class="grid grid-cols-2 gap-4 mb-6">
							{#if diecast.scale}
								<div>
									<p class="text-sm text-gray-600 mb-1">Scale</p>
									<p class="font-medium text-gray-900">{diecast.scale}</p>
								</div>
							{/if}
							{#if diecast.color}
								<div>
									<p class="text-sm text-gray-600 mb-1">Color</p>
									<p class="font-medium text-gray-900">{diecast.color}</p>
								</div>
							{/if}
						</div>

						{#if diecast.notes}
							<div class="mb-6">
								<p class="text-sm text-gray-600 mb-1">Notes</p>
								<p class="text-gray-900 whitespace-pre-wrap">{diecast.notes}</p>
							</div>
						{/if}

						<div class="text-sm text-gray-500">
							<p>
								Added: {new Date(diecast.createdAt).toLocaleDateString()}
							</p>
							{#if diecast.updatedAt !== diecast.createdAt}
								<p>
									Updated: {new Date(diecast.updatedAt).toLocaleDateString()}
								</p>
							{/if}
						</div>
					</div>
				</div>
			{/if}
		{/if}
	</div>
</div>

