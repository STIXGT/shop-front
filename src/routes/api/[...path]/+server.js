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

  try {
    const headers = new Headers(request.headers);

    // Quitar headers hop-by-hop o conflictivos
    headers.delete("host");
    headers.delete("connection");
    headers.delete("content-length");
    headers.delete("accept-encoding");
    // Evita que el backend bloquee por CORS si validara Origin
    headers.delete("origin");
    headers.delete("referer");

    // Info útil para backend/logs
    headers.set("x-forwarded-host", url.host);
    headers.set("x-forwarded-proto", url.protocol.replace(":", ""));
    if (typeof getClientAddress === "function") {
      headers.set("x-forwarded-for", getClientAddress());
    }

    /** @type {RequestInit} */
    const init = {
      method: request.method,
      headers,
    };

    if (request.method !== "GET" && request.method !== "HEAD") {
      // Bufferiza para que el runtime reenvíe el body correctamente.
      init.body = await request.arrayBuffer();
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
