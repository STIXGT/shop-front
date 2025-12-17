import { json } from "@sveltejs/kit";

const BACKEND_URL = "http://98.89.22.41:8000";

async function proxy({ request, params }) {
  const path = params.path.join("/");
  const url = `${BACKEND_URL}/${path}`;

  const res = await fetch(url, {
    method: request.method,
    headers: {
      "Content-Type": "application/json",
    },
    body: request.method !== "GET" ? await request.text() : undefined,
  });

  const data = await res.text();

  return new Response(data, {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("content-type") || "application/json",
    },
  });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const DELETE = proxy;
