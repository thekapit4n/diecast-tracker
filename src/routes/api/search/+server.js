import { json } from '@sveltejs/kit';
import { db } from '$lib/db/index.js';
import { diecasts } from '$lib/db/schema.js';
import { ilike, or, eq, desc } from 'drizzle-orm';

/**
 * GET /api/search
 * Search diecasts by brand, model, or color
 */
export async function GET({ url }) {
	try {
		const query = url.searchParams.get('q');
		const status = url.searchParams.get('status');
		const condition = url.searchParams.get('condition');
		const brand = url.searchParams.get('brand');

		if (!query && !status && !condition && !brand) {
			return json(
				{ success: false, error: 'Search query or filter required' },
				{ status: 400 }
			);
		}

		let dbQuery = db.select().from(diecasts);

		// Text search across brand, model, and color
		if (query) {
			const searchTerm = `%${query}%`;
			dbQuery = dbQuery.where(
				or(
					ilike(diecasts.brand, searchTerm),
					ilike(diecasts.model, searchTerm),
					ilike(diecasts.color, searchTerm)
				)
			);
		}

		// Apply filters
		if (status) {
			dbQuery = dbQuery.where(eq(diecasts.status, status));
		}
		if (condition) {
			dbQuery = dbQuery.where(eq(diecasts.condition, condition));
		}
		if (brand) {
			dbQuery = dbQuery.where(eq(diecasts.brand, brand));
		}

		const results = await dbQuery.orderBy(desc(diecasts.createdAt));

		return json({ success: true, data: results });
	} catch (error) {
		console.error('Error searching diecasts:', error);
		return json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}

