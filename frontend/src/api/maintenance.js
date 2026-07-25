// api/maintenance.js
import apiFetch from "./client";

export function getMaintenanceRecords(equipmentId = null) {
    const params = equipmentId ? `?equipment_id=${equipmentId}` : "";
    return apiFetch(`/maintenance/${params}`);
}

export function createMaintenanceRecord(data) {
    return apiFetch("/maintenance/", { method: "POST", body: JSON.stringify(data) });
}
