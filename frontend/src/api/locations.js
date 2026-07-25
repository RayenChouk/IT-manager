// api/locations.js
import apiFetch from "./client";

export function getLocations() {
    return apiFetch("/locations/");
}

export function createLocation(data) {
    return apiFetch("/locations/", { method: "POST", body: JSON.stringify(data) });
}

export function updateLocation(id, data) {
    return apiFetch(`/locations/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export function deleteLocation(id) {
    return apiFetch(`/locations/${id}`, { method: "DELETE" });
}
