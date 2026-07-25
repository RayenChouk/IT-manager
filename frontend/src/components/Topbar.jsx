// components/Topbar.jsx
// Shows the current page title and the logged-in username.

import "../styles/layout.css";

export default function Topbar({ title, username }) {
    return (
        <header className="topbar">
            <span className="topbar-title">{title}</span>
            <div className="topbar-user">
                <span>👤 {username}</span>
            </div>
        </header>
    );
}
