import { pgTable, serial, varchar, text, timestamp, pgEnum } from 'drizzle-orm/pg-core';

/**
 * Status enum for diecast tracking
 */
export const statusEnum = pgEnum('status', ['pre-order', 'purchased', 'in-transit']);

/**
 * Condition enum for diecast state
 */
export const conditionEnum = pgEnum('condition', ['sealed', 'unboxed']);

/**
 * Diecasts table schema
 */
export const diecasts = pgTable('diecasts', {
	id: serial('id').primaryKey(),
	brand: varchar('brand', { length: 100 }).notNull(),
	model: varchar('model', { length: 200 }).notNull(),
	scale: varchar('scale', { length: 20 }),
	color: varchar('color', { length: 50 }),
	status: statusEnum('status').notNull().default('purchased'),
	condition: conditionEnum('condition').notNull().default('sealed'),
	imageUrl: text('image_url'),
	notes: text('notes'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

/**
 * Brands table for autocomplete and reference
 */
export const brands = pgTable('brands', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 100 }).notNull().unique(),
	createdAt: timestamp('created_at').defaultNow().notNull()
});

