// hooks/useAuth.js
// Manages authentication state: login, logout, and token persistence.
// We store the token in localStorage so it survives page refreshes.

import { useState, useCallback } from "react";
import { login as apiLogin } from "../api/auth";

export function useAuth() {
    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const isLoggedIn = Boolean(token);

    async function login(username, password) {
        setLoading(true);
        setError(null);
        try {
            const data = await apiLogin(username, password);
            localStorage.setItem("token", data.access_token);
            setToken(data.access_token);
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    }

    const logout = useCallback(() => {
        localStorage.removeItem("token");
        setToken(null);
    }, []);

    return { isLoggedIn, token, login, logout, error, loading };
}
