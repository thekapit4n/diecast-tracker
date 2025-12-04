<script>
	let { diecast } = $props();

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

<a
	href="/diecast/{diecast.id}"
	class="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
>
	{#if diecast.imageUrl}
		<img
			src={diecast.imageUrl}
			alt="{diecast.brand} {diecast.model}"
			class="w-full h-48 object-cover"
		/>
	{:else}
		<div class="w-full h-48 bg-gray-200 flex items-center justify-center">
			<svg
				class="w-16 h-16 text-gray-400"
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

	<div class="p-4">
		<div class="flex items-start justify-between mb-2">
			<div class="flex-1">
				<h3 class="font-semibold text-lg text-gray-900 truncate">
					{diecast.brand}
				</h3>
				<p class="text-sm text-gray-600 truncate">{diecast.model}</p>
			</div>
		</div>

		<div class="flex flex-wrap gap-2 mb-2">
			<span
				class="px-2 py-1 text-xs font-medium rounded-full {statusColors[diecast.status]}"
			>
				{diecast.status.replace('-', ' ')}
			</span>
			<span
				class="px-2 py-1 text-xs font-medium rounded-full {conditionColors[diecast.condition]}"
			>
				{diecast.condition}
			</span>
		</div>

		<div class="text-xs text-gray-500 space-y-1">
			{#if diecast.scale}
				<p>Scale: {diecast.scale}</p>
			{/if}
			{#if diecast.color}
				<p>Color: {diecast.color}</p>
			{/if}
		</div>
	</div>
</a>

