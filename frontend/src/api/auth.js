// api/auth.js
import apiFetch from "./client";

export async function login(username, password) {
    return apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
    });
}
