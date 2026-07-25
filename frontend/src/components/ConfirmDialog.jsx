// components/ConfirmDialog.jsx
// A simple confirmation modal before destructive actions.

import Modal from "./Modal";

export default function ConfirmDialog({ message, onConfirm, onCancel }) {
    return (
        <Modal title="Confirm Action" onClose={onCancel}>
            <p style={{ marginBottom: "1.5rem", color: "var(--color-text-muted)" }}>
                {message}
            </p>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                <button className="btn-ghost" onClick={onCancel}>Cancel</button>
                <button className="btn-danger" onClick={onConfirm}>Delete</button>
            </div>
        </Modal>
    );
}
