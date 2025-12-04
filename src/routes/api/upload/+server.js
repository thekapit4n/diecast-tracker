import { json } from '@sveltejs/kit';
import { uploadImage } from '$lib/storage.js';

/**
 * POST /api/upload
 * Handle image upload
 */
export async function POST({ request }) {
	try {
		const formData = await request.formData();
		const file = formData.get('file');

		if (!file || !(file instanceof File)) {
			return json(
				{ success: false, error: 'No file provided' },
				{ status: 400 }
			);
		}

		// Validate file type
		if (!file.type.startsWith('image/')) {
			return json(
				{ success: false, error: 'File must be an image' },
				{ status: 400 }
			);
		}

		// Validate file size (max 5MB)
		const maxSize = 5 * 1024 * 1024; // 5MB
		if (file.size > maxSize) {
			return json(
				{ success: false, error: 'File size must be less than 5MB' },
				{ status: 400 }
			);
		}

		const imageUrl = await uploadImage(file);

		return json({ success: true, data: { url: imageUrl } });
	} catch (error) {
		console.error('Error uploading image:', error);
		return json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}

