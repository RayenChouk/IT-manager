// App.jsx
// Root component. Handles authentication and routing.
// We keep routing here instead of a separate router file to reduce files.

import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import EquipmentPage from "./pages/EquipmentPage";
import LocationsPage from "./pages/LocationsPage";
import MaintenancePage from "./pages/MaintenancePage";
import "./styles/layout.css";

// Page title per route
const PAGE_TITLES = {
  "/": "Dashboard",
  "/equipment": "Equipment",
  "/locations": "Locations",
  "/maintenance": "Maintenance",
};

function AppShell({ auth }) {
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] ?? "IT Manager";

  // Extract username from JWT payload (middle segment, base64 encoded)


  let username = "";

  try {
    if (
      auth.token &&
      auth.token !== "demo-token" &&
      auth.token.split(".").length === 3
    ) {
      username = JSON.parse(atob(auth.token.split(".")[1])).sub;
    }
  } catch {
    username = "";
  }

  return (
    <div className="app-shell">
      <Sidebar onLogout={auth.logout} />
      <div className="main-area">
        <Topbar title={title} username={username} />
        <main className="page-content">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/equipment" element={<EquipmentPage />} />
            <Route path="/locations" element={<LocationsPage />} />
            <Route path="/maintenance" element={<MaintenancePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const auth = useAuth();

  return (
    <BrowserRouter>
      {auth.isLoggedIn ? (
        <AppShell auth={auth} />
      ) : (
        <Routes>
          <Route path="*" element={<LoginPage onLogin={auth.login} />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}
