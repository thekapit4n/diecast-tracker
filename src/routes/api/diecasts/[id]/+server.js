import { json } from '@sveltejs/kit';
import { db } from '$lib/db/index.js';
import { diecasts } from '$lib/db/schema.js';
import { eq } from 'drizzle-orm';

/**
 * GET /api/diecasts/[id]
 * Get a single diecast by ID
 */
export async function GET({ params }) {
	try {
		const id = parseInt(params.id);

		if (isNaN(id)) {
			return json(
				{ success: false, error: 'Invalid ID' },
				{ status: 400 }
			);
		}

		const [diecast] = await db
			.select()
			.from(diecasts)
			.where(eq(diecasts.id, id))
			.limit(1);

		if (!diecast) {
			return json(
				{ success: false, error: 'Diecast not found' },
				{ status: 404 }
			);
		}

		return json({ success: true, data: diecast });
	} catch (error) {
		console.error('Error fetching diecast:', error);
		return json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}

/**
 * PUT /api/diecasts/[id]
 * Update a diecast entry
 */
export async function PUT({ params, request }) {
	try {
		const id = parseInt(params.id);

		if (isNaN(id)) {
			return json(
				{ success: false, error: 'Invalid ID' },
				{ status: 400 }
			);
		}

		const body = await request.json();
		const { brand, model, scale, color, status, condition, imageUrl, notes } = body;

		// Build update object (only include provided fields)
		const updateData = { updatedAt: new Date() };
		if (brand !== undefined) updateData.brand = brand;
		if (model !== undefined) updateData.model = model;
		if (scale !== undefined) updateData.scale = scale;
		if (color !== undefined) updateData.color = color;
		if (status !== undefined) updateData.status = status;
		if (condition !== undefined) updateData.condition = condition;
		if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
		if (notes !== undefined) updateData.notes = notes;

		const [updated] = await db
			.update(diecasts)
			.set(updateData)
			.where(eq(diecasts.id, id))
			.returning();

		if (!updated) {
			return json(
				{ success: false, error: 'Diecast not found' },
				{ status: 404 }
			);
		}

		return json({ success: true, data: updated });
	} catch (error) {
		console.error('Error updating diecast:', error);
		return json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}

/**
 * DELETE /api/diecasts/[id]
 * Delete a diecast entry
 */
export async function DELETE({ params }) {
	try {
		const id = parseInt(params.id);

		if (isNaN(id)) {
			return json(
				{ success: false, error: 'Invalid ID' },
				{ status: 400 }
			);
		}

		const [deleted] = await db
			.delete(diecasts)
			.where(eq(diecasts.id, id))
			.returning();

		if (!deleted) {
			return json(
				{ success: false, error: 'Diecast not found' },
				{ status: 404 }
			);
		}

		return json({ success: true, data: deleted });
	} catch (error) {
		console.error('Error deleting diecast:', error);
		return json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}

