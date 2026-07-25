// components/StatusBadge.jsx
// Renders a colored badge based on equipment status.

export default function StatusBadge({ status }) {
    const classMap = {
        Active: "badge badge-active",
        Inactive: "badge badge-inactive",
        Broken: "badge badge-broken",
        Maintenance: "badge badge-maintenance",
    };

    return (
        <span className={classMap[status] ?? "badge badge-inactive"}>
            {status}
        </span>
    );
}
