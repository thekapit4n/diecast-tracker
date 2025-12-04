import { db } from './index.js';
import { brands } from './schema.js';

/**
 * Seed initial brand data
 */
const initialBrands = [
	'MINI GT',
	'Tarmac Works',
	'Ignition Model',
	'Hot Wheels',
	'Pop Race',
	'Tomica',
	'Greenlight',
	'Matchbox',
	'Auto World',
	'Johnny Lightning'
];

export async function seedBrands() {
	try {
		for (const brandName of initialBrands) {
			await db.insert(brands).values({ name: brandName }).onConflictDoNothing();
		}
		console.log('Brands seeded successfully');
	} catch (error) {
		console.error('Seed error:', error);
		throw error;
	}
}

