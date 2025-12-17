export const API_BASE = "/api";

/**
 * Helper para realizar peticiones al backend
 * @param {string} endpoint
 * @param {RequestInit} [options]
 */
export async function api(endpoint, options = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }

  if (res.status === 204) return null;

  return res.json();
}
