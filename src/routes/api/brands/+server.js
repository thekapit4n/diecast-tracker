import { json } from '@sveltejs/kit';
import { db } from '$lib/db/index.js';
import { brands, diecasts } from '$lib/db/schema.js';
import { distinct, ilike } from 'drizzle-orm';

/**
 * GET /api/brands
 * Get all unique brands (for autocomplete)
 */
export async function GET({ url }) {
	try {
		const query = url.searchParams.get('q');

		if (query) {
			// Search brands from diecasts table for autocomplete
			const results = await db
				.selectDistinct({ brand: diecasts.brand })
				.from(diecasts)
				.where(ilike(diecasts.brand, `%${query}%`))
				.limit(20);

			return json({
				success: true,
				data: results.map((r) => r.brand).sort()
			});
		}

		// Get all unique brands
		const results = await db
			.selectDistinct({ brand: diecasts.brand })
			.from(diecasts)
			.limit(100);

		return json({
			success: true,
			data: results.map((r) => r.brand).sort()
		});
	} catch (error) {
		console.error('Error fetching brands:', error);
		return json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}

