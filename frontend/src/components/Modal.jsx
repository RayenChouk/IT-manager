// components/Modal.jsx
// Reusable modal dialog. Children render as the modal body.

import { useEffect } from "react";
import styles from "./Modal.module.css";

export default function Modal({ title, onClose, children }) {
    // Close on Escape key press
    useEffect(() => {
        function handleKey(e) {
            if (e.key === "Escape") onClose();
        }
        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [onClose]);

    return (
        <div className={styles.overlay} onClick={onClose}>
            {/* Stop propagation so clicking inside the modal doesn't close it */}
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h3>{title}</h3>
                    <button className={styles.closeBtn} onClick={onClose}>✕</button>
                </div>
                <div className={styles.body}>{children}</div>
            </div>
        </div>
    );
}
