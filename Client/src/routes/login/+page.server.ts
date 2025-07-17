import { hash, verify } from '@node-rs/argon2';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { validateInviteCode as checkInviteCode, useInviteCode } from '$lib/server/invitation';
import type { Actions, RequestEvent } from '@sveltejs/kit';

export const load = async (event: RequestEvent) => {
	if (event.locals.user) {
		return redirect(302, '/dashboard');
	}
	return {};
};

export const actions: Actions = {
	login: async (event) => {
		const formData = await event.request.formData();
		const email = formData.get('email');
		const password = formData.get('password');

		if (!validateEmail(email) || !validatePassword(password)) {
			return fail(400, {
				message: 'Invalid email or password'
			});
		}

		const results = await db.select().from(table.user).where(eq(table.user.email, email));

		const existingUser = results.at(0);
		if (!existingUser) {
			return fail(400, { message: 'Incorrect email or password' });
		}

		const validPassword = await verify(existingUser.passwordHash, password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});
		if (!validPassword) {
			return fail(400, { message: 'Incorrect email or password' });
		}

		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, existingUser.id);
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

		return redirect(302, '/dashboard');
	},
	register: async (event) => {
		const formData = await event.request.formData();
		const name = formData.get('name');
		const email = formData.get('email');
		const password = formData.get('password');
		const inviteCode = formData.get('inviteCode');

		// Generate username from name
		let username = "";
		if (name != null) {
			username = name.toString().replace(/\s+/g, "_").toLowerCase();
		}

		if (!validateName(name)) {
			return fail(400, { message: 'Invalid name (min 2, max 50 characters)' });
		}
		if (!validatePassword(password)) {
			return fail(400, { message: 'Invalid password (min 6, max 255 characters)' });
		}
		if (!validateInviteCode(inviteCode)) {
			return fail(400, { message: 'Invalid invite code format' });
		}
		if (!validateEmail(email)) {
			return fail(400, { message: 'Invalid email format' });
		}

		// Validate invite code
		const isValidInvite = await checkInviteCode(inviteCode);
		if (!isValidInvite) {
			return fail(400, { message: 'Invalid or expired invite code' });
		}

		const userId = generateUserId();
		const passwordHash = await hash(password, {
			// recommended minimum parameters
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		try {
			await db.insert(table.user).values({ id: userId, username, passwordHash, name, email });

			// Mark invite code as used
			await useInviteCode(inviteCode, userId);

			const sessionToken = auth.generateSessionToken();
			const session = await auth.createSession(sessionToken, userId);
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
		} catch (error) {
			console.error('Registration error:', error);
			return fail(500, { message: 'An error has occurred during registration' });
		}
		return redirect(302, '/dashboard');
	}
};

function generateUserId() {
	// ID with 120 bits of entropy, or about the same as UUID v4.
	const bytes = crypto.getRandomValues(new Uint8Array(15));
	const id = encodeBase32LowerCase(bytes);
	return id;
}

function validateUsername(username: unknown): username is string {
	return (
		typeof username === 'string' &&
		username.length >= 3 &&
		username.length <= 31 &&
		/^[a-z0-9_-]+$/.test(username)
	);
}

function validateEmail(email: unknown): email is string {
	return typeof email === "string" && email.includes("@") && email.length >= 6 && email.length <= 255;
}

function validatePassword(password: unknown): password is string {
	return typeof password === 'string' && password.length >= 6 && password.length <= 255;
}

function validateInviteCode(code: unknown): code is string {
	return typeof code === 'string' && code.length >= 4 && code.length <= 20;
}

function validateName(name: unknown): name is string {
	return typeof name === 'string' && name.length >= 2 && name.length <= 50;
}
