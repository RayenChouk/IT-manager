// pages/EquipmentPage.jsx
// Full CRUD interface for equipment with search, filter, form modal, and delete.

import { useState, useCallback } from "react";
import {
    getEquipment,
    createEquipment,
    updateEquipment,
    deleteEquipment,
} from "../api/equipment";
import { getLocations } from "../api/locations";
import { useFetch } from "../hooks/useFetch";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import StatusBadge from "../components/StatusBadge";
import Toast from "../components/Toast";
import styles from "./EquipmentPage.module.css";

const EQUIPMENT_TYPES = ["Computer", "Printer", "Monitor", "Switch", "Router", "Server", "Other"];
const EQUIPMENT_STATUSES = ["Active", "Inactive", "Broken", "Maintenance"];

// ── Equipment Form ─────────────────────────────────────────────────────────────

function EquipmentForm({ initial, locations, onSubmit, onClose }) {
    const [form, setForm] = useState({
        name: initial?.name ?? "",
        serial_number: initial?.serial_number ?? "",
        type: initial?.type ?? EQUIPMENT_TYPES[0],
        status: initial?.status ?? "Active",
        location_id: initial?.location_id || (locations.length > 0 ? locations[0].id : ""),
        warranty_end_date: initial?.warranty_end_date ?? "",
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
            const payload = {
                ...form,
                location_id: form.location_id ? Number(form.location_id) : null,
                warranty_end_date: form.warranty_end_date || null,
            };
            await onSubmit(payload);
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
                <input value={form.name} onChange={set("name")} required />
            </div>
            <div className={styles.field}>
                <label>Serial Number</label>
                <input value={form.serial_number} onChange={set("serial_number")} required />
            </div>
            <div className={styles.row}>
                <div className={styles.field}>
                    <label>Type</label>
                    <select value={form.type} onChange={set("type")}>
                        {EQUIPMENT_TYPES.map((t) => <option key={t}>{t}</option>)}
                    </select>
                </div>
                <div className={styles.field}>
                    <label>Status</label>
                    <select value={form.status} onChange={set("status")}>
                        {EQUIPMENT_STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                </div>
            </div>
            <div className={styles.field}>
                <label>Location</label>
                <select value={form.location_id} onChange={set("location_id")} required>
                    {locations.map((loc) => (
                        <option key={loc.id} value={loc.id}>{loc.name}</option>
                    ))}
                </select>
            </div>
            <div className={styles.field}>
                <label>Warranty End Date</label>
                <input type="date" value={form.warranty_end_date} onChange={set("warranty_end_date")} />
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

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function EquipmentPage() {
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [deletingItem, setDeletingItem] = useState(null);
    const [toast, setToast] = useState(null);

    const fetchEquipment = useCallback(
        () => getEquipment({ search, type: typeFilter, status: statusFilter }),
        [search, typeFilter, statusFilter]
    );

    const { data: equipment, loading, error, refetch } = useFetch(fetchEquipment, [search, typeFilter, statusFilter]);
    const { data: locations } = useFetch(getLocations);

    function showToast(message, type = "success") {
        setToast({ message, type });
    }

    async function handleCreate(data) {
        await createEquipment(data);
        refetch();
        showToast("Equipment created successfully!");
    }

    async function handleUpdate(data) {
        await updateEquipment(editingItem.id, data);
        refetch();
        showToast("Equipment updated successfully!");
    }

    async function handleDelete() {
        await deleteEquipment(deletingItem.id);
        setDeletingItem(null);
        refetch();
        showToast("Equipment deleted.");
    }

    return (
        <div>
            {/* ── Toolbar ── */}
            <div className={styles.toolbar}>
                <input
                    className={styles.searchInput}
                    placeholder="🔍  Search by name or serial..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                    <option value="">All types</option>
                    {EQUIPMENT_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="">All statuses</option>
                    {EQUIPMENT_STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
                <button className="btn-primary" onClick={() => { setEditingItem(null); setShowForm(true); }}>
                    + Add Equipment
                </button>
            </div>

            {/* ── Content ── */}
            {loading && <div className="loading-center"><div className="spinner" /></div>}
            {error && <p style={{ color: "var(--color-danger)", padding: "1rem" }}>{error}</p>}

            {!loading && !error && (
                equipment?.length === 0 ? (
                    <div className="empty-state">
                        <div style={{ fontSize: "3rem" }}>🖥️</div>
                        <p>No equipment found.</p>
                    </div>
                ) : (
                    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Serial Number</th>
                                    <th>Type</th>
                                    <th>Status</th>
                                    <th>Location</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {equipment?.map((item) => (
                                    <tr key={item.id}>
                                        <td><strong>{item.name}</strong></td>
                                        <td className="text-muted">{item.serial_number}</td>
                                        <td>{item.type}</td>
                                        <td><StatusBadge status={item.status} /></td>
                                        <td className="text-muted">{item.location?.name ?? "—"}</td>
                                        <td>
                                            <div className={styles.rowActions}>
                                                <button className="btn-ghost" onClick={() => { setEditingItem(item); setShowForm(true); }}>Edit</button>
                                                <button className="btn-danger" onClick={() => setDeletingItem(item)}>Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            )}

            {/* ── Modals ── */}
            {showForm && (
                <Modal title={editingItem ? "Edit Equipment" : "Add Equipment"} onClose={() => setShowForm(false)}>
                    <EquipmentForm
                        initial={editingItem}
                        locations={locations ?? []}
                        onSubmit={editingItem ? handleUpdate : handleCreate}
                        onClose={() => setShowForm(false)}
                    />
                </Modal>
            )}

            {deletingItem && (
                <ConfirmDialog
                    message={`Delete "${deletingItem.name}"? This action cannot be undone.`}
                    onConfirm={handleDelete}
                    onCancel={() => setDeletingItem(null)}
                />
            )}

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}
