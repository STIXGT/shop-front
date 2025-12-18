import { json } from "@sveltejs/kit";

function normalizeBackendUrl(raw) {
  // Si en Vercel configuraste BACKEND_URL sin puerto (ej: http://98.89.22.41)
  // aquí forzamos :8000 para tu FastAPI.
  try {
    const u = new URL(raw);
    if (!u.port) {
      u.port = "8000";
    }
    return u.toString().replace(/\/$/, "");
  } catch {
    return String(raw).replace(/\/$/, "");
  }
}

const BACKEND_URL = normalizeBackendUrl(
  process.env.BACKEND_URL ?? "http://98.89.22.41:8000"
);

/**
 * Proxy genérico para reenviar /api/* hacia el backend.
 * Bufferiza el body para evitar problemas de streams en runtimes serverless.
 * @type {import('./$types').RequestHandler}
 */
async function proxy({ request, params, url, fetch, getClientAddress }) {
  const backendBase = BACKEND_URL.replace(/\/$/, "");
  const path = params.path ?? "";
  const targetUrl = new URL(`${backendBase}/${path}`);
  targetUrl.search = url.search;

  // Evita redirects de FastAPI por slash final (ej: /products -> /products/)
  // que en serverless pueden romper POST/PUT/PATCH.
  if (
    !targetUrl.pathname.endsWith("/") &&
    !targetUrl.pathname.split("/").pop()?.includes(".")
  ) {
    targetUrl.pathname = `${targetUrl.pathname}/`;
  }

  try {
    // Mantenerlo simple: enviar solo lo necesario al backend
    // (evita efectos secundarios con x-forwarded-* y CORS).
    const headers = new Headers();
    const contentType = request.headers.get("content-type");
    if (contentType) headers.set("content-type", contentType);
    headers.set("accept", "application/json");
    const authorization = request.headers.get("authorization");
    if (authorization) headers.set("authorization", authorization);

    /** @type {RequestInit} */
    const init = {
      method: request.method,
      headers,
    };

    if (request.method !== "GET" && request.method !== "HEAD") {
      // Enviar como texto es suficiente para JSON y evita problemas de stream.
      init.body = await request.text();
    }

    const res = await fetch(targetUrl, init);

    // Re-emitimos la respuesta (sin tocar body) para soportar streams.
    const outHeaders = new Headers(res.headers);
    // Header de depuración: te dice a qué URL real se llamó.
    outHeaders.set("x-proxy-target", targetUrl.toString());

    return new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers: outHeaders,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("❌ Proxy /api error:", {
      message,
      targetUrl: targetUrl.toString(),
    });
    return json(
      {
        ok: false,
        message: "Bad Gateway",
        detail: message,
        target: targetUrl.toString(),
      },
      { status: 502 }
    );
  }
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const DELETE = proxy;
export const PATCH = proxy;
export const OPTIONS = proxy;
