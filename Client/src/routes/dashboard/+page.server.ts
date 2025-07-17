import * as auth from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, RequestEvent } from '@sveltejs/kit';

export const load = async (event: RequestEvent) => {
	const user = requireLogin(event);
	return { user };
};

export const actions: Actions = {
	logout: async (event) => {
		if (!event.locals.session) {
			return fail(401);
		}
		await auth.invalidateSession(event.locals.session.id);
		auth.deleteSessionTokenCookie(event);

		return redirect(302, '/login');
	}
};

function requireLogin(event: RequestEvent) {
	if (!event.locals.user) {
		return redirect(302, '/login');
	}

	return event.locals.user;
}
