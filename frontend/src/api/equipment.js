// api/equipment.js
import apiFetch from "./client";

export function getEquipment({ search = "", type = "", status = "", location_id = "" } = {}) {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (type) params.set("type", type);
    if (status) params.set("status", status);
    if (location_id) params.set("location_id", location_id);
    return apiFetch(`/equipment/?${params.toString()}`);
}

export function getEquipmentStats() {
    return apiFetch("/equipment/stats");
}

export function createEquipment(data) {
    return apiFetch("/equipment/", { method: "POST", body: JSON.stringify(data) });
}

export function updateEquipment(id, data) {
    return apiFetch(`/equipment/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export function deleteEquipment(id) {
    return apiFetch(`/equipment/${id}`, { method: "DELETE" });
}
