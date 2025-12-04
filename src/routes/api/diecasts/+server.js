import { json } from '@sveltejs/kit';
import { db } from '$lib/db/index.js';
import { diecasts } from '$lib/db/schema.js';
import { eq, desc } from 'drizzle-orm';

/**
 * GET /api/diecasts
 * Get all diecasts with optional query parameters for filtering
 */
export async function GET({ url }) {
	try {
		const status = url.searchParams.get('status');
		const condition = url.searchParams.get('condition');
		const brand = url.searchParams.get('brand');
		const limit = parseInt(url.searchParams.get('limit') || '100');
		const offset = parseInt(url.searchParams.get('offset') || '0');

		let query = db.select().from(diecasts);

		// Apply filters
		if (status) {
			query = query.where(eq(diecasts.status, status));
		}
		if (condition) {
			query = query.where(eq(diecasts.condition, condition));
		}
		if (brand) {
			query = query.where(eq(diecasts.brand, brand));
		}

		// Order by created date (newest first) and apply pagination
		const results = await query
			.orderBy(desc(diecasts.createdAt))
			.limit(limit)
			.offset(offset);

		return json({ success: true, data: results });
	} catch (error) {
		console.error('Error fetching diecasts:', error);
		return json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}

/**
 * POST /api/diecasts
 * Create a new diecast entry
 */
export async function POST({ request }) {
	try {
		const body = await request.json();
		const {
			brand,
			model,
			scale,
			color,
			status = 'purchased',
			condition = 'sealed',
			imageUrl,
			notes
		} = body;

		// Validation
		if (!brand || !model) {
			return json(
				{ success: false, error: 'Brand and model are required' },
				{ status: 400 }
			);
		}

		const [newDiecast] = await db
			.insert(diecasts)
			.values({
				brand,
				model,
				scale,
				color,
				status,
				condition,
				imageUrl,
				notes,
				updatedAt: new Date()
			})
			.returning();

		return json({ success: true, data: newDiecast }, { status: 201 });
	} catch (error) {
		console.error('Error creating diecast:', error);
		return json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}

