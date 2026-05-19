import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./sidebar.css";
import { LogOut } from "lucide-react";

// Admin-only nav items
const ADMIN_NAV = [
  {
    group: "Main",
    items: [
      { label: "Dashboard", icon: "ti-layout-dashboard", path: "/admin/dashboard" },
    ],
  },
  {
    group: "Management",
    items: [
      { label: "Users",     icon: "ti-users",    path: "/admin/users" },
      { label: "Employees", icon: "ti-id-badge", path: "/admin/employees" },
      { label: "Services",  icon: "ti-tool",     path: "/admin/services" },
      { label: "Feedback",  icon: "ti-message",  path: "/admin/feedback" },
    ],
  },
];

// Employee-only nav items
const EMPLOYEE_NAV = [
  {
    group: "Main",
    items: [
      { label: "Dashboard", icon: "ti-layout-dashboard", path: "/employee/dashboard" },
    ],
  },
  {
    group: "Work",
    items: [
      { label: "My Bookings", icon: "ti-calendar",   path: "/employee/bookings" },
      { label: "Feedbak",    icon: "ti-id-badge",        path: "/employee/feedback" },
    ],
  },
];

const Sidebar = () => {
  const navigate = useNavigate();

  // Read user from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.role || "employee";
  const name = user?.name || "User";

  const navItems = role === "admin" ? ADMIN_NAV : EMPLOYEE_NAV;
  const consoleLabel = role === "admin" ? "Admin Console" : "Employee Panel";
  const avatarLetter = name.charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("user");
    // Dispatch event to notify Header and other components
    window.dispatchEvent(new Event("authChange"));
    navigate("/");
  };

  return (
    <aside className="sidebar-wrap">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="brand-icon">
          <i className="ti ti-home-2" aria-hidden="true" />
        </div>
        <div className="brand-text">
          <span className="brand-name">FixBuddy</span>
          <span className="brand-sub">{consoleLabel}</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {navItems.map(({ group, items }) => (
          <div className="nav-group" key={group}>
            <span className="nav-group-label">{group}</span>
            {items.map(({ label, icon, path }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}
                title={label}
              >
                <i className={`ti ${icon}`} aria-hidden="true" />
                <span className="nav-label">{label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="admin-avatar">{avatarLetter}</div>
        <div className="admin-info">
          <span className="admin-name">{name}</span>
          <span className="admin-role">{role === "admin" ? "Super Admin" : "Employee"}</span>
        </div>
        <button className="collapse-btn" onClick={handleLogout} aria-label="Logout">
          <LogOut />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
