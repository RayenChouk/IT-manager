// components/Toast.jsx
// Temporary success/error notification that disappears after 3 seconds.

import { useEffect } from "react";
import styles from "./Toast.module.css";

export default function Toast({ message, type = "success", onClose }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`${styles.toast} ${styles[type]}`}>
            <span>{type === "success" ? "✅" : "❌"} {message}</span>
            <button onClick={onClose}>✕</button>
        </div>
    );
}
