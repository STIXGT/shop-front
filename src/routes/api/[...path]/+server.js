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
    // Borramos content-length para que fetch lo recalcule correctamente al enviar el nuevo body
    headers.delete("content-length");

    const options = {
      method: request.method,
      headers: headers,
    };

    // Solo adjuntamos el body si no es GET ni HEAD
    if (request.method !== "GET" && request.method !== "HEAD") {
      // Leemos el body como ArrayBuffer para asegurar que se transfiere completo y sin errores de stream
      const body = await request.arrayBuffer();
      options.body = body;
    }

    const response = await fetch(targetUrl, options);

    return response;
  } catch (err) {
    console.error("Error en Proxy:", err);
    throw error(502, "No se pudo conectar con el servidor Backend");
  }
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const DELETE = proxy;
export const PATCH = proxy;
