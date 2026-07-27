// api/client.js
// Central HTTP helper that attaches the JWT token to every request.
// All other api/ files use this instead of calling fetch() directly.

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

/**
 * Makes an authenticated API request.
 * @param {string} path - e.g. "/equipment/"
 * @param {object} options - fetch options (method, body, etc.)
 */
async function apiFetch(path, options = {}) {
    const token = localStorage.getItem("token");

    const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const response = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers,
    });

    // Parse error body so callers get a useful message.
    if (!response.ok) {
        if (response.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/";
            return;
        }
        const error = await response.json().catch(() => ({ detail: "Request failed" }));
        throw new Error(error.detail || "Request failed");
    }

    // 204 No Content has no body, so we return null instead of trying to parse it.
    if (response.status === 204) return null;

    return response.json();
}

export default apiFetch;
