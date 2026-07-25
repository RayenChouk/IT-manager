// components/Sidebar.jsx
// Left navigation panel.

import { NavLink } from "react-router-dom";
import "../styles/layout.css";

const navItems = [
    { to: "/", label: "Dashboard", icon: "📊" },
    { to: "/equipment", label: "Equipment", icon: "🖥️" },
    { to: "/locations", label: "Locations", icon: "📍" },
    { to: "/maintenance", label: "Maintenance", icon: "🔧" },
];

export default function Sidebar({ onLogout }) {
    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <span style={{ fontSize: "1.5rem" }}>⚙️</span>
                <h1>IT<span>Manager</span></h1>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === "/"}
                        className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
                    >
                        <span>{item.icon}</span>
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <button className="btn-ghost w-full" onClick={onLogout}>
                    🚪 Logout
                </button>
            </div>
        </aside>
    );
}
