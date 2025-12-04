import { createClient } from '@supabase/supabase-js';

/**
 * Storage utility for image uploads
 * Supports both Supabase Storage and can be extended for Vercel Blob
 */
let supabaseClient = null;

if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
	supabaseClient = createClient(
		process.env.SUPABASE_URL,
		process.env.SUPABASE_SERVICE_ROLE_KEY
	);
}

/**
 * Upload image to storage
 * @param {File} file - The image file to upload
 * @param {string} folder - Folder path in storage (default: 'diecasts')
 * @returns {Promise<string>} Public URL of uploaded image
 */
export async function uploadImage(file, folder = 'diecasts') {
	if (!supabaseClient) {
		throw new Error('Storage not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
	}

	const fileExt = file.name.split('.').pop();
	const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
	const filePath = `${folder}/${fileName}`;

	// Convert File to ArrayBuffer
	const arrayBuffer = await file.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);

	const { data, error } = await supabaseClient.storage
		.from('images')
		.upload(filePath, buffer, {
			contentType: file.type,
			upsert: false
		});

	if (error) {
		throw new Error(`Upload failed: ${error.message}`);
	}

	// Get public URL
	const { data: urlData } = supabaseClient.storage
		.from('images')
		.getPublicUrl(filePath);

	return urlData.publicUrl;
}

/**
 * Delete image from storage
 * @param {string} filePath - Path to the file in storage
 */
export async function deleteImage(filePath) {
	if (!supabaseClient) {
		throw new Error('Storage not configured');
	}

	const { error } = await supabaseClient.storage
		.from('images')
		.remove([filePath]);

	if (error) {
		throw new Error(`Delete failed: ${error.message}`);
	}
}

