# 🛍️ TiendaApp - Sistema de Gestión de Pedidos

¡Bienvenido a **TiendaApp**! Una aplicación web moderna y eficiente diseñada para conectar vendedores con clientes. Esta plataforma permite gestionar un inventario de productos y recibir pedidos en tiempo real de manera sencilla e intuitiva.

## ✨ Características Principales

La aplicación cuenta con dos roles principales, cada uno con su propia interfaz optimizada:

### 👨‍💼 Panel de Vendedor (`/seller`)

- **Gestión de Inventario:** Agrega nuevos productos con nombre, descripción, precio y stock.
- **Control de Stock:** Visualiza rápidamente la disponibilidad de tus artículos.
- **Recepción de Pedidos:** Una tabla detallada con todos los pedidos recibidos, incluyendo la información del cliente y el producto solicitado.

### 🛒 Tienda para Clientes (`/client`)

- **Catálogo Visual:** Explora los productos disponibles con tarjetas informativas.
- **Estado en Tiempo Real:** Indicadores visuales de disponibilidad (Disponible/Agotado).
- **Pedidos Fáciles:** Un formulario modal elegante para realizar pedidos sin salir de la página.

## 🚀 Tecnologías Utilizadas

Este proyecto ha sido construido con las últimas tecnologías de desarrollo web para asegurar rendimiento y escalabilidad:

- **[SvelteKit](https://kit.svelte.dev/):** Framework principal para una experiencia de usuario fluida y rápida.
- **[Vite](https://vitejs.dev/):** Entorno de desarrollo de próxima generación.
- **CSS Moderno:** Diseño responsivo y limpio sin dependencias pesadas.
- **Proxy Inverso:** Configuración integrada para conectar fácilmente con cualquier backend.

## 🛠️ Instalación y Ejecución

Sigue estos pasos para correr el proyecto en tu máquina local:

1. **Clonar el repositorio** (o descargar los archivos):

   ```bash
   git clone <tu-repo-url>
   cd segundo-examen
   ```

2. **Instalar dependencias:**

   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
4. **Abrir en el navegador:**
   Visita `http://localhost:5173` para ver la aplicación.

## 🔌 Conexión con el Backend

Esta aplicación está lista para conectarse a tu API REST.

- **Configuración:** El archivo `vite.config.js` incluye un proxy inverso preconfigurado en `/api` que redirige a `http://localhost:3000`.
- **Formatos de Datos:** La aplicación espera y envía datos en formato JSON específico.
- **Instrucciones Detalladas:** Consulta el archivo [INSTRUCCIONES_BACKEND.md](./INSTRUCCIONES_BACKEND.md) para ver la documentación completa de los endpoints y estructuras JSON requeridas.

## 📂 Estructura del Proyecto

```
src/
├── lib/           # Utilidades y componentes compartidos (api.js)
├── routes/        # Rutas de la aplicación (SvelteKit)
│   ├── client/    # Página de la tienda para clientes
│   ├── seller/    # Panel de administración para vendedores
│   └── +page.svelte # Página de inicio (Selección de rol)
└── app.css        # Estilos globales
```

---

Desarrollado para el Segundo Examen de Desarrollo Web.
