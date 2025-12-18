import { error } from "@sveltejs/kit";

const BACKEND_URL = "http://98.89.22.41:8000";

/**
 * Función genérica para hacer proxy de todas las peticiones
 * @type {import('./$types').RequestHandler}
 */
async function proxy({ request, params, url, fetch }) {
  // params.path captura todo lo que va después de /api/
  // Ejemplo: /api/products -> path: "products"
  const path = params.path;
  const query = url.search;
  const targetUrl = `${BACKEND_URL}/${path}${query}`;

  try {
    // Preparamos los headers para enviar al backend
    const headers = new Headers(request.headers);

    // Eliminamos headers que pueden causar conflictos
    headers.delete("host");
    headers.delete("connection");
    headers.delete("content-length");
    // Eliminamos origin y referer para evitar bloqueos por CORS en el backend (simulamos ser Postman)
    headers.delete("origin");
    headers.delete("referer");

    const options = {
      method: request.method,
      headers: headers,
      duplex: "half", // Requerido en algunas versiones de Node para POSTs
    };

    // Solo adjuntamos el body si no es GET ni HEAD
    if (request.method !== "GET" && request.method !== "HEAD") {
      // Leemos el body como ArrayBuffer para asegurar que se transfiere completo
      const body = await request.arrayBuffer();
      options.body = body;
    }

    const response = await fetch(targetUrl, options);

    return response;
  } catch (err) {
    // Logueamos el error real para depuración
    console.error("❌ Error en Proxy:", err.message, "| URL:", targetUrl);
    throw error(502, `Error de conexión con Backend: ${err.message}`);
  }
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const DELETE = proxy;
export const PATCH = proxy;
