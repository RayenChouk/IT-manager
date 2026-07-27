// api/auth.js
import apiFetch from "./client";

export async function login(username, password) {
    return apiFetch("/auth/login", {     //already return a promise that s why we didnt use await
        method: "POST",
        body: JSON.stringify({ username, password }),
    });
}
