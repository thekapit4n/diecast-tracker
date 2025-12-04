import { createClient } from '@supabase/supabase-js';

/**
 * Storage utility for image uploads using Supabase Storage
 * Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables
 */
let supabaseClient = null;

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (supabaseUrl && supabaseServiceKey) {
	supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
		auth: {
			autoRefreshToken: false,
			persistSession: false
		}
	});
} else {
	console.warn(
		'Supabase storage not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env file.'
	);
}

/**
 * Ensure the images bucket exists, create it if it doesn't
 */
async function ensureBucketExists() {
	if (!supabaseClient) {
		throw new Error('Storage not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
	}

	// Check if bucket exists
	const { data: buckets, error: listError } = await supabaseClient.storage.listBuckets();
	
	if (listError) {
		throw new Error(`Failed to list buckets: ${listError.message}`);
	}

	const bucketExists = buckets?.some((bucket) => bucket.name === 'images');

	if (!bucketExists) {
		// Create the bucket
		const { data, error: createError } = await supabaseClient.storage.createBucket('images', {
			public: true,
			fileSizeLimit: 5242880, // 5MB
			allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
		});

		if (createError) {
			throw new Error(
				`Bucket 'images' does not exist and could not be created: ${createError.message}. ` +
				'Please create it manually in Supabase Dashboard > Storage > New bucket (name: "images", public: true)'
			);
		}
	}
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

	// Ensure bucket exists
	await ensureBucketExists();

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

