<svelte:head>
	<title>Inicio - TiendaApp</title>
</svelte:head>

<div class="home">
	<h1>Bienvenido a TiendaApp</h1>
	<p>Selecciona tu rol para continuar:</p>

	<div class="cards">
		<a href="/client" class="card role-card">
			<h2>Cliente</h2>
			<p>Ver productos y realizar pedidos.</p>
		</a>
		<a href="/seller" class="card role-card">
			<h2>Vendedor</h2>
			<p>Gestionar inventario y ver pedidos.</p>
		</a>
	</div>
</div>

<style>
	.home {
		text-align: center;
		padding: 4rem 0;
	}

	h1 {
		font-size: 2.5rem;
		margin-bottom: 1rem;
		color: #1e293b;
	}

	p {
		font-size: 1.2rem;
		color: #64748b;
		margin-bottom: 3rem;
	}

	.cards {
		display: flex;
		justify-content: center;
		gap: 2rem;
		flex-wrap: wrap;
	}

	.role-card {
		text-decoration: none;
		color: inherit;
		width: 300px;
		transition: transform 0.2s, box-shadow 0.2s;
		border: 2px solid transparent;
	}

	.role-card:hover {
		transform: translateY(-5px);
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
		border-color: #2563eb;
	}

	.role-card h2 {
		color: #2563eb;
		margin-top: 0;
	}

	.role-card p {
		font-size: 1rem;
		margin-bottom: 0;
	}
</style>
