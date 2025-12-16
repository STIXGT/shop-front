<script>
	import { onMount } from 'svelte';
	import { api } from '$lib/api';

	let products = $state([]);
	let orders = $state([]);
	let newProduct = $state({ name: '', description: '', price: 0, stock: 0 });
	let loading = $state(false);
	let error = $state(null);

	// Helper para obtener nombre del producto por ID
	function getProductName(id) {
		const p = products.find(p => p.id === id);
		return p ? p.name : `Producto #${id}`;
	}

	async function loadData() {
		loading = true;
		try {
			// Cargar productos y pedidos en paralelo
			const [productsData, ordersData] = await Promise.all([
				api('/products'),
				api('/orders')
			]);
			
			products = productsData || [];
			orders = ordersData || [];
		} catch (e) {
			error = e.message;
			// Mock data fallback si falla la API (para demo)
			if (products.length === 0) {
				products = [
					{ id: 1, name: 'Laptop Gamer ASUS', description: 'Laptop con Ryzen 7, 16GB RAM y RTX 3060', price: 1450.99, stock: 6 }
				];
			}
			if (orders.length === 0) {
				orders = [
					{ id: 1, product_id: 1, customer_name: 'Juan Pérez', customer_address: 'Av. Siempre Viva 742, Quito', customer_phone: '0991234567', quantity: 2 }
				];
			}
		} finally {
			loading = false;
		}
	}

	async function addProduct() {
		if (!newProduct.name || newProduct.stock < 0) return;
		
		try {
			await api('/products', {
				method: 'POST',
				body: JSON.stringify(newProduct)
			});
			
			// Recargar datos para ver el nuevo producto
			await loadData();
			newProduct = { name: '', description: '', price: 0, stock: 0 };
			alert('Producto agregado');
		} catch (e) {
			alert('Error al agregar producto: ' + e.message);
		}
	}

	onMount(loadData);
</script>

<svelte:head>
	<title>Vendedor - TiendaApp</title>
</svelte:head>

<div class="seller-dashboard">
	<h1>Panel de Vendedor</h1>

	{#if error}
		<div class="error">Error: {error}</div>
	{/if}

	<div class="grid">
		<section class="card">
			<h2>Agregar Producto</h2>
			<form onsubmit={(e) => { e.preventDefault(); addProduct(); }}>
				<div class="form-group">
					<label for="name">Nombre del Artículo</label>
					<input type="text" id="name" bind:value={newProduct.name} placeholder="Ej. Laptop Gamer" required />
				</div>
				<div class="form-group">
					<label for="description">Descripción</label>
					<textarea id="description" bind:value={newProduct.description} placeholder="Detalles del producto..." required></textarea>
				</div>
				<div class="form-group">
					<label for="price">Precio ($)</label>
					<input type="number" id="price" bind:value={newProduct.price} min="0" step="0.01" required />
				</div>
				<div class="form-group">
					<label for="stock">Stock Disponible</label>
					<input type="number" id="stock" bind:value={newProduct.stock} min="0" required />
				</div>
				<button type="submit" class="primary">Publicar Artículo</button>
			</form>
		</section>

		<section class="card">
			<h2>Mis Artículos</h2>
			{#if products.length === 0}
				<p>No hay artículos publicados.</p>
			{:else}
				<ul class="item-list">
					{#each products as product}
						<li class="item">
							<div class="item-info">
								<span class="name">{product.name}</span>
								<small class="desc">{product.description}</small>
								<span class="price">${product.price}</span>
							</div>
							<span class="stock badge">Stock: {product.stock}</span>
						</li>
					{/each}
				</ul>
			{/if}
		</section>
	</div>

	<section class="card full-width">
		<h2>Pedidos Recibidos</h2>
		{#if orders.length === 0}
			<p>No hay pedidos aún.</p>
		{:else}
			<div class="table-container">
				<table>
					<thead>
						<tr>
							<th>Producto</th>
							<th>Cant.</th>
							<th>Cliente</th>
							<th>Dirección</th>
							<th>Teléfono</th>
						</tr>
					</thead>
					<tbody>
						{#each orders as order}
							<tr>
								<td>{getProductName(order.product_id)}</td>
								<td>{order.quantity}</td>
								<td>{order.customer_name}</td>
								<td>{order.customer_address}</td>
								<td>{order.customer_phone}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</section>
</div>

<style>
	.seller-dashboard {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
	}

	@media (max-width: 768px) {
		.grid {
			grid-template-columns: 1fr;
		}
	}

	.full-width {
		width: 100%;
	}

	.form-group {
		margin-bottom: 1rem;
	}

	label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 500;
		color: #475569;
	}

	.item-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem 0;
		border-bottom: 1px solid #e2e8f0;
	}

	.item-info {
		display: flex;
		flex-direction: column;
	}

	.item-info .desc {
		color: #64748b;
		font-size: 0.85rem;
	}

	.item-info .price {
		font-weight: bold;
		color: #2563eb;
	}

	.item:last-child {
		border-bottom: none;
	}

	.badge {
		background-color: #e0f2fe;
		color: #0369a1;
		padding: 0.25rem 0.75rem;
		border-radius: 9999px;
		font-size: 0.875rem;
		font-weight: 600;
	}

	.table-container {
		overflow-x: auto;
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}

	th, td {
		text-align: left;
		padding: 1rem;
		border-bottom: 1px solid #e2e8f0;
	}

	th {
		background-color: #f8fafc;
		font-weight: 600;
		color: #475569;
	}

	.error {
		background-color: #fee2e2;
		color: #b91c1c;
		padding: 1rem;
		border-radius: 0.5rem;
	}
</style>
