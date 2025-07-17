import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

export const load = async (event: RequestEvent) => {
	if (event.locals.user) {
		return redirect(302, '/home');
	} else {
		return redirect(302, '/login');
	}
};
