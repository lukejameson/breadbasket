
import { pgTable, serial, integer, text, timestamp, boolean } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	age: integer('age'),
	username: text('username').notNull().unique(),
	name: text('name').notNull().unique(),
	email: text('email').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	isAdmin: boolean('is_admin').notNull().default(false)
});

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export const invitationCodes = pgTable('invitation_codes', {
	id: serial('id').primaryKey(),
	code: text('code').notNull().unique(),
	used: boolean('used').notNull().default(false),
	usedBy: text('used_by').references(() => user.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	usedAt: timestamp('used_at')
});

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;

export type InvitationCode = typeof invitationCodes.$inferSelect;
