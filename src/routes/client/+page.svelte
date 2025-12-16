<script>
	import { onMount } from 'svelte';
	import { api } from '$lib/api';

	let products = $state([]);
	let selectedProduct = $state(null);
	let orderForm = $state({ customer_name: '', customer_address: '', customer_phone: '', quantity: 1 });
	let showModal = $state(false);
	let loading = $state(false);

	async function loadProducts() {
		try {
			products = await api('/products');
			
		} catch (e) {
			console.error(e);
			// Mock data fallback
			if (!products || products.length === 0) {
				products = [
					{ id: 1, name: 'Laptop Gamer ASUS', description: 'Laptop con Ryzen 7, 16GB RAM y RTX 3060', price: 1450.99, stock: 6 },
					{ id: 2, name: 'Mouse Logitech', description: 'Mouse inalámbrico ergonómico', price: 25.50, stock: 15 }
				];
			}
		}
	}

	function openOrderModal(product) {
		selectedProduct = product;
		orderForm = { customer_name: '', customer_address: '', customer_phone: '', quantity: 1 };
		showModal = true;
	}

	async function submitOrder() {
		if (!selectedProduct) return;

		try {
			loading = true;
			await api('/orders', {
				method: 'POST',
				body: JSON.stringify({
					product_id: selectedProduct.id,
					...orderForm
				})
			});
			
			alert(`¡Pedido realizado con éxito! Gracias ${orderForm.customer_name}.`);
			showModal = false;
		    loadProducts();
		} catch (e) {
			alert('Error al realizar el pedido: ' + e.message);
		} finally {
			loading = false;
		}
	}

	onMount(loadProducts);
</script>

<svelte:head>
	<title>Tienda - TiendaApp</title>
</svelte:head>

<div class="client-shop">
	<h1>Catálogo de Productos</h1>

	<div class="products-grid">
		{#each products as product}
			<div class="card product-card">
				<div class="product-info">
					<h3>{product.name}</h3>
					<p class="desc">{product.description}</p>
					<p class="price">${product.price}</p>
					<p class={product.stock > 0 ? 'stock-ok' : 'stock-out'}>
						{product.stock > 0 ? `Disponible: ${product.stock}` : 'Agotado'}
					</p>
				</div>
				<button 
					class="primary" 
					disabled={product.stock === 0}
					onclick={() => openOrderModal(product)}
				>
					{product.stock > 0 ? 'Pedir' : 'Sin Stock'}
				</button>
			</div>
		{/each}
	</div>
</div>

{#if showModal}
	<div class="modal-backdrop" onclick={() => showModal = false} role="button" tabindex="0" onkeydown={(e) => e.key === 'Escape' && (showModal = false)}>
		<div class="modal" onclick={(e) => e.stopPropagation()} role="button" tabindex="0" onkeydown={(e) => e.key === 'Escape' && (showModal = false)}>
			<h2>Realizar Pedido</h2>
			<p>Estás pidiendo: <strong>{selectedProduct?.name}</strong></p>
			
			<form onsubmit={(e) => { e.preventDefault(); submitOrder(); }}>
				<div class="form-group">
					<label for="c-name">Nombre Completo</label>
					<input type="text" id="c-name" bind:value={orderForm.customer_name} required />
				</div>
				
				<div class="form-group">
					<label for="c-address">Dirección de Envío</label>
					<input type="text" id="c-address" bind:value={orderForm.customer_address} required />
				</div>

				<div class="form-group">
					<label for="c-phone">Número de Teléfono</label>
					<input type="tel" id="c-phone" bind:value={orderForm.customer_phone} required />
				</div>

				<div class="form-group">
					<label for="c-qty">Cantidad</label>
					<input type="number" id="c-qty" bind:value={orderForm.quantity} min="1" max={selectedProduct?.stock} required />
				</div>

				<div class="modal-actions">
					<button type="button" class="secondary" onclick={() => showModal = false}>Cancelar</button>
					<button type="submit" class="primary" disabled={loading}>
						{loading ? 'Procesando...' : 'Confirmar Pedido'}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<style>
	.products-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 2rem;
		margin-top: 2rem;
	}

	.product-card {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 100%;
		transition: transform 0.2s;
	}

	.product-card:hover {
		transform: translateY(-5px);
	}

	.product-info h3 {
		margin-top: 0;
		color: #1e293b;
	}

	.product-info .desc {
		color: #64748b;
		font-size: 0.9rem;
		margin-bottom: 0.5rem;
	}

	.product-info .price {
		font-size: 1.2rem;
		font-weight: bold;
		color: #2563eb;
		margin: 0.5rem 0;
	}

	.stock-ok {
		color: #16a34a;
		font-weight: 600;
	}

	.stock-out {
		color: #dc2626;
		font-weight: 600;
	}

	/* Modal Styles */
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
		backdrop-filter: blur(2px);
	}

	.modal {
		background-color: white;
		padding: 2rem;
		border-radius: 0.5rem;
		width: 90%;
		max-width: 500px;
		box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
	}

	.modal h2 {
		margin-top: 0;
	}

	.modal-actions {
		display: flex;
		justify-content: flex-end;
		gap: 1rem;
		margin-top: 2rem;
	}

	.form-group {
		margin-bottom: 1rem;
	}

	label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 500;
	}
</style>
