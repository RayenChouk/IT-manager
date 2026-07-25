// pages/LocationsPage.jsx
// CRUD interface for building locations.

import { useState, useCallback } from "react";
import { getLocations, createLocation, updateLocation, deleteLocation } from "../api/locations";
import { useFetch } from "../hooks/useFetch";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import Toast from "../components/Toast";
import styles from "./EquipmentPage.module.css"; // reuse same table/form styles

function LocationForm({ initial, onSubmit, onClose }) {
    const [form, setForm] = useState({
        name: initial?.name ?? "",
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    function set(field) {
        return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        setError("");
        try {
            await onSubmit({ name: form.name, x: 50, y: 50 });
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
                <label>Name</label>
                <input value={form.name} onChange={set("name")} required placeholder="e.g. Server Room" />
            </div>
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.actions}>
                <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={saving}>
                    {saving ? "Saving…" : "Save"}
                </button>
            </div>
        </form>
    );
}

export default function LocationsPage() {
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [deletingItem, setDeletingItem] = useState(null);
    const [toast, setToast] = useState(null);

    const { data: locations, loading, error, refetch } = useFetch(getLocations);

    function showToast(message) { setToast({ message, type: "success" }); }

    async function handleCreate(data) { await createLocation(data); refetch(); showToast("Location created!"); }
    async function handleUpdate(data) { await updateLocation(editingItem.id, data); refetch(); showToast("Location updated!"); }
    async function handleDelete() { await deleteLocation(deletingItem.id); setDeletingItem(null); refetch(); showToast("Location deleted."); }

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1.25rem" }}>
                <button className="btn-primary" onClick={() => { setEditingItem(null); setShowForm(true); }}>
                    + Add Location
                </button>
            </div>

            {loading && <div className="loading-center"><div className="spinner" /></div>}
            {error && <p style={{ color: "var(--color-danger)" }}>{error}</p>}

            {!loading && !error && (
                locations?.length === 0 ? (
                    <div className="empty-state">
                        <div style={{ fontSize: "3rem" }}>📍</div>
                        <p>No locations defined yet.</p>
                    </div>
                ) : (
                    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {locations?.map((loc) => (
                                    <tr key={loc.id}>
                                        <td><strong>{loc.name}</strong></td>
                                        <td>
                                            <div className={styles.rowActions}>
                                                <button className="btn-ghost" onClick={() => { setEditingItem(loc); setShowForm(true); }}>Edit</button>
                                                <button className="btn-danger" onClick={() => setDeletingItem(loc)}>Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            )}

            {showForm && (
                <Modal title={editingItem ? "Edit Location" : "Add Location"} onClose={() => setShowForm(false)}>
                    <LocationForm
                        initial={editingItem}
                        onSubmit={editingItem ? handleUpdate : handleCreate}
                        onClose={() => setShowForm(false)}
                    />
                </Modal>
            )}

            {deletingItem && (
                <ConfirmDialog
                    message={`Delete location "${deletingItem.name}"?`}
                    onConfirm={handleDelete}
                    onCancel={() => setDeletingItem(null)}
                />
            )}

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}
