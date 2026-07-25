// pages/DashboardPage.jsx
// Shows summary stats and recent equipment at a glance.

import { getEquipmentStats, getEquipment } from "../api/equipment";
import { useFetch } from "../hooks/useFetch";
import StatusBadge from "../components/StatusBadge";
import styles from "./DashboardPage.module.css";

// A single stat card on the dashboard.
function StatCard({ label, value, icon, color }) {
    return (
        <div className={styles.statCard} style={{ borderTopColor: color }}>
            <span className={styles.statIcon}>{icon}</span>
            <div>
                <p className={styles.statValue}>{value}</p>
                <p className={styles.statLabel}>{label}</p>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    const { data: stats, loading: statsLoading } = useFetch(getEquipmentStats);
    const { data: equipment, loading: equipLoading } = useFetch(getEquipment);

    const recentEquipment = equipment?.slice(0, 5) ?? [];

    if (statsLoading || equipLoading) {
        return <div className="loading-center"><div className="spinner" /></div>;
    }

    return (
        <div>
            <div className={styles.grid}>
                <StatCard label="Total Equipment" value={stats?.total ?? 0} icon="🖥️" color="var(--color-primary)" />
                <StatCard label="Active" value={stats?.active ?? 0} icon="✅" color="var(--color-success)" />
                <StatCard label="Broken" value={stats?.broken ?? 0} icon="❌" color="var(--color-danger)" />
                <StatCard label="Maintenance" value={stats?.maintenance ?? 0} icon="🔧" color="var(--color-warning)" />
                <StatCard label="Inactive" value={stats?.inactive ?? 0} icon="📦" color="#64748b" />
                <StatCard label="Expiring Soon" value={stats?.expiring_soon ?? 0} icon="⚠️" color="#f59e0b" />
            </div>

            <div className="card" style={{ marginTop: "1.5rem" }}>
                <h3 style={{ marginBottom: "1rem" }}>Recent Equipment</h3>

                {recentEquipment.length === 0 ? (
                    <div className="empty-state">
                        <p>No equipment found.</p>
                    </div>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Location</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentEquipment.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.name}</td>
                                    <td>{item.type}</td>
                                    <td><StatusBadge status={item.status} /></td>
                                    <td className="text-muted">{item.location?.name ?? "—"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
