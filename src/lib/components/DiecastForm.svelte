<script>
	import ImageUpload from './ImageUpload.svelte';

	let { diecast = null, onSubmit = () => {}, onCancel = () => {} } = $props();

	let brand = $state(diecast?.brand || '');
	let model = $state(diecast?.model || '');
	let scale = $state(diecast?.scale || '');
	let color = $state(diecast?.color || '');
	let status = $state(diecast?.status || 'purchased');
	let condition = $state(diecast?.condition || 'sealed');
	let imageUrl = $state(diecast?.imageUrl || '');
	let notes = $state(diecast?.notes || '');

	let brandSuggestions = $state([]);
	let showBrandSuggestions = $state(false);
	let brandInputFocused = $state(false);
	let loading = $state(false);
	let error = $state(null);

	// Debounce function for search
	let searchTimeout;
	function debounceSearch(query, callback, delay = 300) {
		clearTimeout(searchTimeout);
		searchTimeout = setTimeout(() => callback(query), delay);
	}

	async function searchBrands(query) {
		if (!query || query.length < 1) {
			brandSuggestions = [];
			return;
		}

		try {
			const response = await fetch(`/api/brands?q=${encodeURIComponent(query)}`);
			const result = await response.json();
			if (result.success) {
				brandSuggestions = result.data;
			}
		} catch (err) {
			console.error('Error fetching brands:', err);
		}
	}

	function handleBrandInput(event) {
		const value = event.target.value;
		brand = value;
		debounceSearch(value, searchBrands);
		showBrandSuggestions = value.length > 0 && brandInputFocused;
	}

	function selectBrand(brandName) {
		brand = brandName;
		brandSuggestions = [];
		showBrandSuggestions = false;
	}

	async function handleSubmit(event) {
		event.preventDefault();
		error = null;

		// Validation
		if (!brand.trim()) {
			error = 'Brand is required';
			return;
		}
		if (!model.trim()) {
			error = 'Model is required';
			return;
		}

		loading = true;

		try {
			const data = {
				brand: brand.trim(),
				model: model.trim(),
				scale: scale.trim() || null,
				color: color.trim() || null,
				status,
				condition,
				imageUrl: imageUrl || null,
				notes: notes.trim() || null
			};

			const url = diecast ? `/api/diecasts/${diecast.id}` : '/api/diecasts';
			const method = diecast ? 'PUT' : 'POST';

			const response = await fetch(url, {
				method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data)
			});

			const result = await response.json();

			if (!result.success) {
				throw new Error(result.error || 'Failed to save diecast');
			}

			onSubmit(result.data);
		} catch (err) {
			error = err.message || 'An error occurred';
		} finally {
			loading = false;
		}
	}
</script>

<form onsubmit={handleSubmit} class="space-y-6">
	{#if error}
		<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
			{error}
		</div>
	{/if}

	<!-- Brand -->
	<div class="relative">
		<label for="brand" class="block text-sm font-medium text-gray-700 mb-1">
			Brand <span class="text-red-500">*</span>
		</label>
		<input
			id="brand"
			type="text"
			bind:value={brand}
			oninput={handleBrandInput}
			onfocus={() => {
				brandInputFocused = true;
				showBrandSuggestions = brand.length > 0;
			}}
			onblur={() => {
				brandInputFocused = false;
				setTimeout(() => {
					showBrandSuggestions = false;
				}, 200);
			}}
			required
			class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
			placeholder="e.g., MINI GT, Tarmac Works"
		/>
		{#if showBrandSuggestions && brandSuggestions.length > 0}
			<ul
				class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
			>
				{#each brandSuggestions as suggestion}
					<li>
						<button
							type="button"
							onclick={() => selectBrand(suggestion)}
							class="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
						>
							{suggestion}
						</button>
					</li>
				{/each}
			</ul>
		{/if}
	</div>

	<!-- Model -->
	<div>
		<label for="model" class="block text-sm font-medium text-gray-700 mb-1">
			Model <span class="text-red-500">*</span>
		</label>
		<input
			id="model"
			type="text"
			bind:value={model}
			required
			class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
			placeholder="e.g., Nissan Skyline R34"
		/>
	</div>

	<!-- Scale and Color -->
	<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
		<div>
			<label for="scale" class="block text-sm font-medium text-gray-700 mb-1">
				Scale
			</label>
			<input
				id="scale"
				type="text"
				bind:value={scale}
				class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
				placeholder="e.g., 1:64"
			/>
		</div>
		<div>
			<label for="color" class="block text-sm font-medium text-gray-700 mb-1">
				Color
			</label>
			<input
				id="color"
				type="text"
				bind:value={color}
				class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
				placeholder="e.g., Blue, Red"
			/>
		</div>
	</div>

	<!-- Status and Condition -->
	<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
		<div>
			<label for="status" class="block text-sm font-medium text-gray-700 mb-1">
				Status
			</label>
			<select
				id="status"
				bind:value={status}
				class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
			>
				<option value="pre-order">Pre-order</option>
				<option value="purchased">Purchased</option>
				<option value="in-transit">In Transit</option>
			</select>
		</div>
		<div>
			<label
				for="condition"
				class="block text-sm font-medium text-gray-700 mb-1"
			>
				Condition
			</label>
			<select
				id="condition"
				bind:value={condition}
				class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
			>
				<option value="sealed">Sealed</option>
				<option value="unboxed">Unboxed</option>
			</select>
		</div>
	</div>

	<!-- Image Upload -->
	<div>
		<label class="block text-sm font-medium text-gray-700 mb-1">
			Image
		</label>
		<ImageUpload bind:value={imageUrl} />
	</div>

	<!-- Notes -->
	<div>
		<label for="notes" class="block text-sm font-medium text-gray-700 mb-1">
			Notes
		</label>
		<textarea
			id="notes"
			bind:value={notes}
			rows="3"
			class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
			placeholder="Additional notes..."
		></textarea>
	</div>

	<!-- Actions -->
	<div class="flex gap-4 justify-end">
		{#if onCancel}
			<button
				type="button"
				onclick={onCancel}
				class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
			>
				Cancel
			</button>
		{/if}
		<button
			type="submit"
			disabled={loading}
			class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
		>
			{loading ? 'Saving...' : diecast ? 'Update' : 'Add Diecast'}
		</button>
	</div>
</form>

