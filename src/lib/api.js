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
    let detail = "";
    try {
      detail = await res.text();
    } catch {
      detail = "";
    }

    // Limitar detalle para no llenar el alert/console
    const trimmed =
      detail && detail.length > 500 ? `${detail.slice(0, 500)}...` : detail;
    throw new Error(
      `API Error: ${res.status} ${res.statusText}${
        trimmed ? ` - ${trimmed}` : ""
      }`
    );
  }

  if (res.status === 204) return null;

  return res.json();
}
