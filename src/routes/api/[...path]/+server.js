const BACKEND_URL = "http://98.89.22.41:8000";

async function proxy({ request, params }) {
  // 🛡️ Protección contra rutas vacías
  if (!params.path) {
    return new Response(JSON.stringify({ error: "Invalid API path" }), {
      status: 400,
    });
  }

  const path = params.path.join("/");
  const url = `${BACKEND_URL}/${path}`;

  const headers = {};
  const method = request.method;

  // Solo enviar Content-Type si hay body
  if (method !== "GET" && method !== "HEAD") {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(url, {
    method,
    headers,
    body:
      method !== "GET" && method !== "HEAD" ? await request.text() : undefined,
  });

  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await res.text()
    : await res.text();

  return new Response(data, {
    status: res.status,
    headers: {
      "Content-Type": contentType || "application/json",
    },
  });
}
console.log("➡️ Proxy:", method, url);

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const DELETE = proxy;
