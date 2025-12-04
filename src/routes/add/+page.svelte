<script>
	import DiecastForm from '$lib/components/DiecastForm.svelte';
	import { goto } from '$app/navigation';

	function handleSubmit(diecast) {
		goto(`/diecast/${diecast.id}`);
	}

	function handleCancel() {
		goto('/');
	}
</script>

<div class="min-h-screen bg-gray-50">
	<div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<div class="mb-6">
			<h1 class="text-3xl font-bold text-gray-900 mb-2">Add New Diecast</h1>
			<p class="text-gray-600">Add a new diecast to your collection</p>
		</div>

		<div class="bg-white rounded-lg shadow-md p-6">
			<DiecastForm {onSubmit} {onCancel} />
		</div>
	</div>
</div>

