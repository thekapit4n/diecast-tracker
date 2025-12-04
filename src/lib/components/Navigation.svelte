<script>
	import { page } from '$app/stores';

	let mobileMenuOpen = $state(false);

	const navItems = [
		{ href: '/', label: 'Dashboard' },
		{ href: '/collection', label: 'Collection' },
		{ href: '/add', label: 'Add' }
	];
</script>

<nav class="bg-white shadow-md sticky top-0 z-50">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex justify-between items-center h-16">
			<!-- Logo -->
			<a href="/" class="flex items-center">
				<span class="text-xl font-bold text-gray-900">Diecast Tracker</span>
			</a>

			<!-- Desktop Navigation -->
			<div class="hidden md:flex md:space-x-4">
				{#each navItems as item}
					<a
						href={item.href}
						class="px-3 py-2 rounded-md text-sm font-medium transition-colors {$page.url.pathname === item.href
							? 'bg-blue-100 text-blue-700'
							: 'text-gray-700 hover:bg-gray-100'}"
					>
						{item.label}
					</a>
				{/each}
			</div>

			<!-- Mobile menu button -->
			<button
				type="button"
				onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
				class="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
				aria-label="Toggle menu"
			>
				{#if mobileMenuOpen}
					<svg
						class="h-6 w-6"
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
				{:else}
					<svg
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h16M4 18h16"
						/>
					</svg>
				{/if}
			</button>
		</div>
	</div>

	<!-- Mobile Navigation -->
	{#if mobileMenuOpen}
		<div class="md:hidden border-t border-gray-200">
			<div class="px-2 pt-2 pb-3 space-y-1">
				{#each navItems as item}
					<a
						href={item.href}
						onclick={() => (mobileMenuOpen = false)}
						class="block px-3 py-2 rounded-md text-base font-medium {$page.url.pathname === item.href
							? 'bg-blue-100 text-blue-700'
							: 'text-gray-700 hover:bg-gray-100'}"
					>
						{item.label}
					</a>
				{/each}
			</div>
		</div>
	{/if}
</nav>

