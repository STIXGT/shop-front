import { json } from "@sveltejs/kit";

export async function GET({ url }) {
  const backendUrl =
    process.env.BACKEND_URL +
    url.pathname.replace("/api/proxy", "") +
    url.search;

  const res = await fetch(backendUrl);
  const data = await res.json();

  return json(data);
}

export async function POST({ request, url }) {
  const body = await request.text(); // 👈 IMPORTANTE para PHP

  const backendUrl =
    process.env.BACKEND_URL +
    url.pathname.replace("/api/proxy", "") +
    url.search;

  const res = await fetch(backendUrl, {
    method: "POST",
    headers: {
      "Content-Type": request.headers.get("content-type") || "application/json",
    },
    body,
  });

  const data = await res.text(); // PHP a veces no devuelve JSON puro
  return new Response(data, {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}
