<script>
	let { value = $bindable(), onUpload = () => {} } = $props();

	let fileInput;
	let previewUrl = $state(null);
	let uploading = $state(false);
	let error = $state(null);
	let dragOver = $state(false);

	function handleFileSelect(event) {
		const file = event.target.files?.[0];
		if (file) {
			processFile(file);
		}
	}

	function handleDrop(event) {
		event.preventDefault();
		dragOver = false;
		const file = event.dataTransfer?.files?.[0];
		if (file) {
			processFile(file);
		}
	}

	function handleDragOver(event) {
		event.preventDefault();
		dragOver = true;
	}

	function handleDragLeave() {
		dragOver = false;
	}

	function handleClick() {
		fileInput?.click();
	}

	async function processFile(file) {
		// Validate file type
		if (!file.type.startsWith('image/')) {
			error = 'Please select an image file';
			return;
		}

		// Validate file size (5MB max)
		if (file.size > 5 * 1024 * 1024) {
			error = 'Image must be less than 5MB';
			return;
		}

		error = null;
		previewUrl = URL.createObjectURL(file);
		uploading = true;

		try {
			const formData = new FormData();
			formData.append('file', file);

			const response = await fetch('/api/upload', {
				method: 'POST',
				body: formData
			});

			const result = await response.json();

			if (!result.success) {
				throw new Error(result.error || 'Upload failed');
			}

			value = result.data.url;
			onUpload(result.data.url);
		} catch (err) {
			error = err.message || 'Failed to upload image';
			previewUrl = null;
		} finally {
			uploading = false;
		}
	}

	function removeImage() {
		previewUrl = null;
		value = null;
		error = null;
		if (fileInput) {
			fileInput.value = '';
		}
	}

	// Clean up preview URL when component is destroyed
	$effect(() => {
		return () => {
			if (previewUrl) {
				URL.revokeObjectURL(previewUrl);
			}
		};
	});
</script>

<div class="w-full">
	{#if previewUrl || value}
		<div class="relative">
			<img
				src={previewUrl || value}
				alt="Preview"
				class="w-full h-64 object-cover rounded-lg border-2 border-gray-300"
			/>
			<button
				type="button"
				onclick={removeImage}
				class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
				aria-label="Remove image"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>
		</div>
	{:else}
		<div
			class="border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer {dragOver
				? 'border-blue-500 bg-blue-50'
				: 'border-gray-300 hover:border-gray-400'}"
			onclick={handleClick}
			ondrop={handleDrop}
			ondragover={handleDragOver}
			ondragleave={handleDragLeave}
			role="button"
			tabindex="0"
			onkeydown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					fileInput?.click();
				}
			}}
		>
			<input
				bind:this={fileInput}
				type="file"
				accept="image/*"
				onchange={handleFileSelect}
				class="hidden"
			/>

			{#if uploading}
				<div class="flex flex-col items-center">
					<svg
						class="animate-spin h-8 w-8 text-blue-500 mb-2"
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
					<p class="text-gray-600">Uploading...</p>
				</div>
			{:else}
				<svg
					class="mx-auto h-12 w-12 text-gray-400 mb-4"
					stroke="currentColor"
					fill="none"
					viewBox="0 0 48 48"
				>
					<path
						d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
				<p class="text-gray-600 mb-2">
					<span class="font-semibold">Click to upload</span> or drag and drop
				</p>
				<p class="text-sm text-gray-500">PNG, JPG, GIF up to 5MB</p>
			{/if}
		</div>
	{/if}

	{#if error}
		<p class="mt-2 text-sm text-red-600">{error}</p>
	{/if}
</div>

