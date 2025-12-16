<script>
	import '../app.css';
	let { children } = $props();
</script>

<div class="app-container">
	<header>
		<nav>
			<a href="/" class="brand">TiendaApp</a>
			<div class="links">
				<a href="/client">Cliente</a>
				<a href="/seller">Vendedor</a>
			</div>
		</nav>
	</header>

	<main>
		{@render children()}
	</main>

	<footer>
		<p>&copy; 2025 TiendaApp - Examen Frontend</p>
	</footer>
</div>

<style>
	:global(body) {
		margin: 0;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		background-color: #f5f7fa;
		color: #333;
	}

	:global(*) {
		box-sizing: border-box;
	}

	.app-container {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	header {
		background-color: #ffffff;
		box-shadow: 0 2px 4px rgba(0,0,0,0.1);
		padding: 1rem 2rem;
	}

	nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		max-width: 1200px;
		margin: 0 auto;
	}

	.brand {
		font-size: 1.5rem;
		font-weight: bold;
		color: #2563eb;
		text-decoration: none;
	}

	.links a {
		margin-left: 1.5rem;
		text-decoration: none;
		color: #64748b;
		font-weight: 500;
		transition: color 0.2s;
	}

	.links a:hover {
		color: #2563eb;
	}

	main {
		flex: 1;
		padding: 2rem;
		max-width: 1200px;
		margin: 0 auto;
		width: 100%;
	}

	footer {
		text-align: center;
		padding: 1.5rem;
		background-color: #1e293b;
		color: #94a3b8;
		margin-top: auto;
	}
</style>
