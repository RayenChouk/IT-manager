// pages/MaintenancePage.jsx
// View maintenance history and log new maintenance records.

import { useState, useCallback } from "react";
import { getMaintenanceRecords, createMaintenanceRecord } from "../api/maintenance";
import { getEquipment } from "../api/equipment";
import { useFetch } from "../hooks/useFetch";
import Modal from "../components/Modal";
import Toast from "../components/Toast";
import styles from "./EquipmentPage.module.css";

function MaintenanceForm({ equipment, onSubmit, onClose }) {
    const [form, setForm] = useState({ equipment_id: "", description: "" });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        setError("");
        try {
            await onSubmit({ equipment_id: Number(form.equipment_id), description: form.description });
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
                <label>Equipment</label>
                <select
                    value={form.equipment_id}
                    onChange={(e) => setForm((p) => ({ ...p, equipment_id: e.target.value }))}
                    required
                >
                    <option value="">— Select equipment —</option>
                    {equipment.map((item) => (
                        <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                </select>
            </div>
            <div className={styles.field}>
                <label>Description</label>
                <textarea
                    rows={4}
                    value={form.description}
                    onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                    placeholder="Describe the maintenance work..."
                    required
                    style={{ resize: "vertical" }}
                />
            </div>
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.actions}>
                <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={saving}>
                    {saving ? "Saving…" : "Log Record"}
                </button>
            </div>
        </form>
    );
}

export default function MaintenancePage() {
    const [showForm, setShowForm] = useState(false);
    const [toast, setToast] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const { data: records, loading, error, refetch } = useFetch(getMaintenanceRecords);
    const { data: equipment } = useFetch(getEquipment);

    async function handleCreate(data) {
        await createMaintenanceRecord(data);
        refetch();
        setToast({ message: "Maintenance record logged!", type: "success" });
    }

    function formatDate(dateStr) {
        return new Date(dateStr).toLocaleDateString("en-GB", {
            day: "2-digit", month: "short", year: "numeric",
            hour: "2-digit", minute: "2-digit",
        });
    }

    const filteredRecords = records?.filter((record) => {
        if (!searchQuery) return true;
        const eqName = (record.equipment?.name || "").toLowerCase();
        return eqName.includes(searchQuery.toLowerCase());
    });

    return (
        <div>
            {/* ── Toolbar ── */}
            <div className={styles.toolbar}>
                <input
                    className={styles.searchInput}
                    placeholder="🔍  Search equipment..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="btn-primary" onClick={() => setShowForm(true)}>
                    + Log Maintenance
                </button>
            </div>

            {loading && <div className="loading-center"><div className="spinner" /></div>}
            {error && <p style={{ color: "var(--color-danger)" }}>{error}</p>}

            {!loading && !error && (
                filteredRecords?.length === 0 ? (
                    <div className="empty-state">
                        <div style={{ fontSize: "3rem" }}>🔧</div>
                        <p>{records?.length === 0 ? "No maintenance records yet." : "No matching maintenance records."}</p>
                    </div>
                ) : (
                    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Equipment</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRecords?.map((record) => (
                                    <tr key={record.id}>
                                        <td className="text-muted" style={{ whiteSpace: "nowrap" }}>
                                            {formatDate(record.date)}
                                        </td>
                                        <td><strong>{record.equipment?.name ?? `#${record.equipment_id}`}</strong></td>
                                        <td>{record.description}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            )}

            {showForm && (
                <Modal title="Log Maintenance Record" onClose={() => setShowForm(false)}>
                    <MaintenanceForm
                        equipment={equipment ?? []}
                        onSubmit={handleCreate}
                        onClose={() => setShowForm(false)}
                    />
                </Modal>
            )}

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}
