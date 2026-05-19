import React, { useEffect, useState } from "react";
import "./dashboard.css";

const BASE_URL = "http://localhost:5000";

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", { dateStyle: "medium" });

/* ── Stat Card ─────────────────────────────────────────────── */
const StatCard = ({ icon, label, value, color, loading }) => (
  <div className={`emp-stat-card emp-stat-card--${color}`}>
    <div className="emp-stat-card__icon">{icon}</div>
    <div>
      <p className="emp-stat-card__label">{label}</p>
      <h2 className="emp-stat-card__value">{loading ? "—" : value ?? 0}</h2>
    </div>
  </div>
);

/* ── Status badge helper ────────────────────────────────────── */
const statusBadgeClass = (status) => {
  if (status === "Pending")  return "emp-badge--yellow";
  if (status === "Approved") return "emp-badge--green";
  if (status === "Rejected") return "emp-badge--red";
  return "";
};

/* ── Dashboard ─────────────────────────────────────────────── */
const EmployeeDashboard = () => {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    const email = localStorage.getItem("employeeEmail");

    if (!email) {
      setError("Employee email not found. Please log in again.");
      setLoading(false);
      return;
    }

    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res  = await fetch(
          `${BASE_URL}/api/employee-dashboard?email=${encodeURIComponent(email)}`
        );
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        } else {
          setError(json.message || "Failed to load dashboard");
        }
      } catch {
        setError("Unable to reach the server. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  /* ── Loading state ────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="emp-dashboard">
        <div className="emp-loading-state">
          <div className="emp-spinner" />
          <p>Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  /* ── Error state ──────────────────────────────────────────── */
  if (error) {
    return (
      <div className="emp-dashboard">
        <div className="emp-dashboard__error">⚠️ {error}</div>
      </div>
    );
  }

  const d = data || {};
  const employee = d.employee || {};

  /* ── No department assigned ───────────────────────────────── */
  if (!d.department) {
    return (
      <div className="emp-dashboard">
        <div className="emp-dashboard__header">
          <div>
            <h1 className="emp-dashboard__title">
              Welcome, {employee.name || "Employee"}
            </h1>
            <p className="emp-dashboard__subtitle">Your dashboard overview</p>
          </div>
        </div>
        <div className="emp-no-dept">
          <div className="emp-no-dept__icon">🏗️</div>
          <p className="emp-no-dept__title">No Department Assigned</p>
          <p className="emp-no-dept__sub">
            Please contact the admin to assign a department to your account.
          </p>
        </div>
      </div>
    );
  }

  /* ── Stat cards config ────────────────────────────────────── */
  const statCards = [
    { icon: "📋", label: "Total Requests",   value: d.totalRequests,    color: "indigo" },
    { icon: "⏳", label: "Pending",           value: d.pendingRequests,  color: "amber"  },
    { icon: "✅", label: "Approved",          value: d.approvedRequests, color: "green"  },
    { icon: "❌", label: "Rejected",          value: d.rejectedRequests, color: "red"    },
  ];

  const statusCards = [
    { label: "Pending",  value: d.pendingRequests,  color: "yellow" },
    { label: "Approved", value: d.approvedRequests, color: "green"  },
    { label: "Rejected", value: d.rejectedRequests, color: "red"    },
  ];

  return (
    <div className="emp-dashboard">

      {/* ── Header ──────────────────────────────────────────── */}
      <div className="emp-dashboard__header">
        <div>
          <h1 className="emp-dashboard__title">
            Welcome, {employee.name || "Employee"}
          </h1>
          <p className="emp-dashboard__subtitle">
            Overview of your {d.department} service requests
          </p>
        </div>

        <div className="emp-dashboard__meta">
          <span className="emp-dashboard__date">
            {new Date().toLocaleDateString("en-IN", { dateStyle: "long" })}
          </span>
          <span className="emp-dashboard__dept-badge">
            🔧 {d.department}
          </span>
        </div>
      </div>

      {/* ── Stat Cards ──────────────────────────────────────── */}
      <div className="emp-stat-grid">
        {statCards.map((c) => (
          <StatCard key={c.label} {...c} loading={false} />
        ))}
      </div>

      {/* ── Status Breakdown ────────────────────────────────── */}
      <h2 className="emp-section-title">Service Request Status</h2>
      <div className="emp-status-grid">
        {statusCards.map((s) => (
          <div
            key={s.label}
            className={`emp-status-card emp-status-card--${s.color}`}
          >
            <span className="emp-status-card__label">{s.label}</span>
            <span className="emp-status-card__value">{s.value ?? 0}</span>
          </div>
        ))}
      </div>

      {/* ── Recent Requests ─────────────────────────────────── */}
      <h2 className="emp-section-title">Recent Service Requests</h2>
      <div className="emp-table-wrapper">
        <table className="emp-recent-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Customer</th>
              <th>Service</th>
              <th>Date</th>
              <th>Phone</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {d.recentRequests?.length ? (
              d.recentRequests.map((req, i) => (
                <tr key={req._id}>
                  <td>{i + 1}</td>
                  <td>{req.name}</td>
                  <td>{req.service}</td>
                  <td>{formatDate(req.createdAt)}</td>
                  <td>{req.phone}</td>
                  <td>
                    <span
                      className={`emp-badge ${statusBadgeClass(req.status)}`}
                    >
                      {req.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="emp-table-empty">
                  No service requests yet for your department.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default EmployeeDashboard;