import { hash } from '@node-rs/argon2';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { pgTable, serial, integer, text, timestamp, boolean } from 'drizzle-orm/pg-core';

// Database schema
const user = pgTable('user', {
	id: text('id').primaryKey(),
	age: integer('age'),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	isAdmin: boolean('is_admin').notNull().default(false)
});

const invitationCodes = pgTable('invitation_codes', {
	id: serial('id').primaryKey(),
	code: text('code').notNull().unique(),
	used: boolean('used').notNull().default(false),
	usedBy: text('used_by').references(() => user.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	usedAt: timestamp('used_at')
});

// Database connection
const connectionString = "postgres://manga_user:manga_password@localhost:5432/breadbasket";

const client = postgres(connectionString);
const db = drizzle(client);

async function seedDatabase() {
	console.log('Seeding database...');

	// Create admin user
	const adminUserId = generateUserId();
	const adminPasswordHash = await hash('admin123', {
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1
	});

	try {
		await db.insert(user).values({
			id: adminUserId,
			username: 'admin',
			passwordHash: adminPasswordHash,
			isAdmin: true
		});
		console.log('✅ Admin user created (username: admin, password: admin123)');
	} catch (error) {
		console.log('ℹ️ Admin user already exists');
	}

	// Create some invite codes
	const inviteCodes = ['WELCOME2024', 'INVITE123', 'BETA2024'];

	for (const code of inviteCodes) {
		try {
			await db.insert(invitationCodes).values({
				code,
				expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
			});
			console.log(`✅ Invite code created: ${code}`);
		} catch (error) {
			console.log(`ℹ️ Invite code ${code} already exists`);
		}
	}

	console.log('\n🎉 Database seeding complete!');
	console.log('You can now:');
	console.log('1. Login with username: admin, password: admin123');
	console.log('2. Use invite codes: WELCOME2024, INVITE123, or BETA2024 to register new users');

	await client.end();
}

function generateUserId() {
	const bytes = crypto.getRandomValues(new Uint8Array(15));
	const id = encodeBase32LowerCase(bytes);
	return id;
}

seedDatabase().catch(console.error);
