# Instrucciones de Configuración del Frontend

Este proyecto es una aplicación SvelteKit configurada para funcionar con un backend local.

## 1. Configuración del Backend (Proxy)

Para conectar tu backend, abre el archivo `vite.config.js` en la raíz del proyecto.

Busca la sección `server.proxy`:

```javascript
server: {
    proxy: {
        '/api': {
            target: 'http://localhost:3000', // <--- CAMBIA ESTO por la URL de tu backend
            changeOrigin: true,
        }
    }
}
```

Si tu backend corre en otro puerto (ej. 8080, 5000), cambia `http://localhost:3000` por la dirección correcta.

## 2. Estructura de la API Esperada

El frontend está configurado para realizar peticiones a las siguientes rutas (prefijo `/api`):

### Productos

- `GET /api/products`: Obtener lista de productos.
  - Respuesta esperada:
    ```json
    [
      {
        "id": 1,
        "name": "Laptop Gamer ASUS",
        "description": "Laptop con Ryzen 7...",
        "price": 1450.99,
        "stock": 6
      }
    ]
    ```
- `POST /api/products`: Crear un producto.
  - Body:
    ```json
    {
      "name": "Laptop Gamer ASUS",
      "description": "Laptop con Ryzen 7...",
      "price": 1450.99,
      "stock": 8
    }
    ```

### Pedidos

- `GET /api/orders`: Obtener lista de pedidos (para el vendedor).
  - Respuesta esperada:
    ```json
    [
      {
        "id": 1,
        "product_id": 1,
        "customer_name": "Juan Pérez",
        "customer_address": "Av. Siempre Viva 742",
        "customer_phone": "0991234567",
        "quantity": 2
      }
    ]
    ```
- `POST /api/orders`: Crear un pedido (para el cliente).
  - Body:
    ```json
    {
      "product_id": 1,
      "customer_name": "Juan Pérez",
      "customer_address": "Av. Siempre Viva 742",
      "customer_phone": "0991234567",
      "quantity": 2
    }
    ```

## 3. Activar las Peticiones Reales

Actualmente, el frontend usa **datos de prueba (Mocks)** para que puedas ver la interfaz sin el backend.

Para activar las peticiones reales:

1. Abre `src/routes/seller/+page.svelte` y `src/routes/client/+page.svelte`.
2. Busca las líneas comentadas que empiezan con `await api(...)`.
3. Descomenta esas líneas y elimina/comenta la asignación de datos de prueba (`products = [...]`).

## 4. Ejecutar el Proyecto

```bash
npm install
npm run dev
```
