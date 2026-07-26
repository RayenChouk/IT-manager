// pages/LoginPage.jsx
// The only page that's visible without authentication.

import { useState } from "react";
import styles from "./LoginPage.module.css";

export default function LoginPage({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);
        const success = await onLogin(username, password);
        if (!success) {
            setError("Invalid username or password.");
        }
        setLoading(false);
    }

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <div className={styles.logo}>⚙️</div>
                <h1 className={styles.title}>IT Manager</h1>
                <p className={styles.subtitle}>Sign in to your account</p>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.field}>
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder=""
                            required
                            autoFocus
                            autoComplete="username"
                        />
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder=""
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    {error && <p className={styles.error}>{error}</p>}

                    <button className="btn-primary w-full" type="submit" disabled={loading}>
                        {loading ? "Signing in…" : "Sign In"}
                    </button>
                </form>


            </div>
        </div>
    );
}
