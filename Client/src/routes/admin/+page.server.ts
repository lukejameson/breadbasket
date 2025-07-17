import { generateInviteCode, getAllInviteCodes } from '$lib/server/invitation';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, RequestEvent } from '@sveltejs/kit';

export const load = async (event: RequestEvent) => {
	if (!event.locals.user) {
		return redirect(302, '/login');
	}

	if (!event.locals.user.isAdmin) {
		return redirect(302, '/dashboard');
	}

	const inviteCodes = await getAllInviteCodes();
	return { inviteCodes };
};

export const actions: Actions = {
	generate: async (event) => {
		if (!event.locals.user) {
			return fail(401, { message: 'Unauthorized' });
		}

		if (!event.locals.user.isAdmin) {
			return fail(403, { message: 'Admin access required' });
		}

		try {
			const code = await generateInviteCode();
			return { success: true, code };
		} catch (error) {
			console.error('Error generating invite code:', error);
			return fail(500, { message: 'Failed to generate invite code' });
		}
	}
};
