// hooks/useFetch.js
// Generic data-fetching hook to avoid repeating loading/error logic.

import { useState, useEffect, useCallback } from "react";

/**
 * @param {Function} fetchFn - An async function that returns data.
 * @param {Array} deps - Dependencies that trigger a refetch when changed.
 */
export function useFetch(fetchFn, deps = []) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await fetchFn();
            setData(result);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    useEffect(() => {
        load();
    }, [load]);

    return { data, loading, error, refetch: load };
}
