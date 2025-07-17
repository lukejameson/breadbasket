<script lang="ts">
	import { enhance } from '$app/forms';
	import '$lib/styles/styles.css';


	let { data, form }: { data: any; form: any } = $props();

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString() + ' ' + new Date(dateString).toLocaleTimeString();
	}
</script>

<div class="container">
	<div class="header">
		<h1>Admin Panel - Invite Codes</h1>
		<a href="/dashboard" class="page-link">Back</a>
	</div>

	<div class="admin-content">
		<div class="generate-section">
			<h2>Generate New Invite Code</h2>
			<form method="post" action="?/generate" use:enhance>
				<button type="submit" class="generate-button">Generate Invite Code</button>
			</form>

			{#if form?.success}
				<div class="success-message">
					<p>New invite code generated: <strong>{form.code}</strong></p>
				</div>
			{/if}

			{#if form?.message}
				<div class="error-message">
					<p>{form.message}</p>
				</div>
			{/if}
		</div>

		<div class="codes-section">
			<h2>All Invite Codes</h2>
			<div class="codes-table">
				<table>
					<thead>
						<tr>
							<th>Code</th>
							<th>Status</th>
							<th>Created</th>
							<th>Expires</th>
							<th>Used By</th>
							<th>Used At</th>
						</tr>
					</thead>
					<tbody>
						{#each data.inviteCodes as code}
							<tr class={code.used ? 'used' : 'active'}>
								<td><strong>{code.code}</strong></td>
								<td>
									<span class="status {code.used ? 'used' : 'active'}">
										{code.used ? 'Used' : 'Active'}
									</span>
								</td>
								<td>{formatDate(code.createdAt)}</td>
								<td>{formatDate(code.expiresAt)}</td>
								<td>{code.usedBy || '-'}</td>
								<td>{code.usedAt ? formatDate(code.usedAt) : '-'}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>

<style>
	.admin-content {
		display: grid;
		gap: 2rem;
	}

	.generate-section,
	.codes-section {
		background: white;
		padding: 1.5rem;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.generate-section h2,
	.codes-section h2 {
		color: #333;
		margin-top: 0;
		margin-bottom: 1rem;
	}

	.generate-button {
		padding: 0.75rem 1.5rem;
		background-color: #28a745;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 1rem;
		font-weight: 500;
		transition: background-color 0.2s;
	}

	.generate-button:hover {
		background-color: #218838;
	}

	.success-message {
		margin-top: 1rem;
		padding: 1rem;
		background-color: #d4edda;
		border: 1px solid #c3e6cb;
		border-radius: 4px;
		color: #155724;
	}

	.error-message {
		margin-top: 1rem;
		padding: 1rem;
		background-color: #f8d7da;
		border: 1px solid #f5c6cb;
		border-radius: 4px;
		color: #721c24;
	}

	.codes-table {
		overflow-x: auto;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		margin-top: 1rem;
	}

	th,
	td {
		padding: 0.75rem;
		text-align: left;
		border-bottom: 1px solid #e0e0e0;
	}

	th {
		background-color: #f8f9fa;
		font-weight: 600;
		color: #333;
	}

	tr.used {
		background-color: #f8f9fa;
		color: #666;
	}

	tr.active {
		background-color: #ffffff;
	}

	.status {
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		font-size: 0.875rem;
		font-weight: 500;
	}

	.status.used {
		background-color: #dc3545;
		color: white;
	}

	.status.active {
		background-color: #28a745;
		color: white;
	}

	@media (max-width: 768px) {
		.admin-header {
			flex-direction: column;
			gap: 1rem;
			text-align: center;
		}

		.codes-table {
			font-size: 0.875rem;
		}

		th,
		td {
			padding: 0.5rem;
		}
	}
</style>
