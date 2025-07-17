<script lang="ts">
	import { enhance } from '$app/forms';
	import '$lib/styles/styles.css';

	let { data }: { data: any } = $props();
</script>

<div class="container">
	<div class="header">
		<h1>Welcome to Dashboard</h1>
		<div class="header-actions">
			{#if data.user.isAdmin}
				<a href="/admin" class="page-link">Admin Panel</a>
			{/if}
			<a href="/home" class="page-link">Home</a>

			<form method="post" action="?/logout" use:enhance>
				<button type="submit" class="logout-button">Sign out</button>
			</form>
		</div>
	</div>

	<div class="card">
		<div class="card-info">
			<h2>User Information</h2>
			<p><strong>Name:</strong> {data.user.name}</p>
			<p><strong>Email:</strong> {data.user.email}</p>
			<p><strong>Username:</strong> {data.user.username}</p>
			<p><strong>User ID:</strong> {data.user.id}</p>
		</div>

		<div class="card-info">
			<h2>Edit Information</h2>
		</div>
	</div>
</div>

<style>
	.logout-button {
		padding: 0.5rem 1rem;
		background-color: #dc3545;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 1rem;
		transition: background-color 0.2s;
	}

	.logout-button:hover {
		background-color: #c82333;
	}

	@media (max-width: 768px) {
		.dashboard-content {
			grid-template-columns: 1fr;
		}

		.dashboard-header {
			flex-direction: column;
			gap: 1rem;
			text-align: center;
		}
	}
</style>
