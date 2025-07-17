import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { pgTable, text, boolean, integer } from 'drizzle-orm/pg-core';
import { eq } from 'drizzle-orm';

// Database schema
const user = pgTable('user', {
	id: text('id').primaryKey(),
	age: integer('age'),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	isAdmin: boolean('is_admin').notNull().default(false)
});

// Database connection
const connectionString = "postgres://manga_user:manga_password@localhost:5432/breadbasket";
const client = postgres(connectionString);
const db = drizzle(client);

async function updateAdminUser() {
	console.log('Updating admin user...');

	try {
		const result = await db.update(user)
			.set({ isAdmin: true })
			.where(eq(user.username, 'admin'))
			.returning();

		if (result.length > 0) {
			console.log('✅ Admin user updated successfully');
		} else {
			console.log('ℹ️ No admin user found to update');
		}
	} catch (error) {
		console.error('Error updating admin user:', error);
	}

	await client.end();
}

updateAdminUser().catch(console.error);
