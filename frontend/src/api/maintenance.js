// api/maintenance.js
import apiFetch from "./client";

export function getMaintenanceRecords(equipmentId = null) {
    const params = new URLSearchParams();
    if (equipmentId) params.set("equipment_id", equipmentId);
    const query = params.toString();
    return apiFetch(`/maintenance/${query ? `?${query}` : ""}`);
}

export function createMaintenanceRecord(data) {
    return apiFetch("/maintenance/", { method: "POST", body: JSON.stringify(data) });
}
