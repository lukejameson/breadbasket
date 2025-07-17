<script lang="ts">
	import { enhance } from '$app/forms';
	import '$lib/styles/styles.css';

	let { form }: { form: any } = $props();
	let isLogin = $state(true);

	function toggleMode() {
		isLogin = !isLogin;
	}
</script>

<div class="auth-container">
	<div class="auth-card">
		<h1>{isLogin ? 'Login' : 'Register'}</h1>

		<div class="tabs">
			<button class="tab {isLogin ? 'active' : ''}" onclick={toggleMode}>Login</button>
			<button class="tab {!isLogin ? 'active' : ''}" onclick={toggleMode}>Register</button>
		</div>

		{#if isLogin}
			<form method="post" action="?/login" use:enhance>
				<div class="form-group">
					<label for="email">Email</label>
					<input id="email" name="email" type="email" required />
				</div>
				<div class="form-group">
					<label for="password">Password</label>
					<input id="password" name="password" type="password" required />
				</div>
				<button type="submit" class="auth-button">Login</button>
			</form>
		{:else}
			<form method="post" action="?/register" use:enhance>
				<div class="form-group">
					<label for="name">Name</label>
					<input id="name" name="name" type="text" required />
				</div>
				<div class="form-group">
					<label for="email">Email Address</label>
					<input id="email" name="email" type="text" required />
				</div>
				<div class="form-group">
					<label for="password">Password</label>
					<input id="password" name="password" type="password" required />
				</div>
				<div class="form-group">
					<label for="inviteCode">Invite Code</label>
					<input id="inviteCode" name="inviteCode" type="text" required />
				</div>
				<button type="submit" class="auth-button">Register</button>
			</form>
		{/if}

		{#if form?.message}
			<p class="error-message">{form.message}</p>
		{/if}
	</div>
</div>

<style>
	.auth-container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		padding: 20px;
	}

	.auth-card {
		background: white;
		padding: 2rem;
		border-radius: 8px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		width: 100%;
		max-width: 400px;
	}

	h1 {
		text-align: center;
		margin-bottom: 1.5rem;
		color: #333;
	}

	.tabs {
		display: flex;
		margin-bottom: 2rem;
		border-bottom: 1px solid #e0e0e0;
	}

	.tab {
		flex: 1;
		padding: 0.75rem 1rem;
		border: none;
		background: none;
		cursor: pointer;
		font-size: 1rem;
		border-bottom: 2px solid transparent;
		transition: all 0.2s;
	}

	.tab.active {
		border-bottom-color: #007bff;
		color: #007bff;
		font-weight: 600;
	}

	.tab:hover {
		background-color: #f8f9fa;
	}

	.form-group {
		margin-bottom: 1.5rem;
	}

	label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 500;
		color: #555;
	}

	input {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: 1rem;
		transition: border-color 0.2s;
	}

	input:focus {
		outline: none;
		border-color: #007bff;
		box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
	}

	.auth-button {
		width: 100%;
		padding: 0.75rem;
		background-color: #007bff;
		color: white;
		border: none;
		border-radius: 4px;
		font-size: 1rem;
		font-weight: 500;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.auth-button:hover {
		background-color: #0056b3;
	}

	.error-message {
		color: #dc3545;
		text-align: center;
		margin-top: 1rem;
		padding: 0.75rem;
		background-color: #f8d7da;
		border: 1px solid #f5c6cb;
		border-radius: 4px;
	}
</style>
