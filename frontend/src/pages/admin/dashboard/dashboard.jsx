import React, { useEffect, useState } from 'react';
import './dashboard.css';

const BASE_URL = 'http://localhost:5000';

const StatCard = ({ icon, label, value, color, loading }) => (
    <div className={`stat-card stat-card--${color}`}>
        <div className="stat-card__icon">{icon}</div>
        <div className="stat-card__body">
            <p className="stat-card__label">{label}</p>
            <h2 className="stat-card__value">{loading ? '—' : value}</h2>
        </div>
    </div>
);

const statusColor = (status) => {
    if (status === 'Pending') return 'badge--yellow';
    if (status === 'Approved') return 'badge--green';
    if (status === 'Rejected') return 'badge--red';
    return '';
};

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${BASE_URL}/api/dashboard`);
                const json = await res.json();
                if (json.success) {
                    setStats(json.data);
                } else {
                    setError(json.message || 'Failed to load dashboard');
                }
            } catch (err) {
                setError('Unable to reach server');
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    const d = stats || {};

    const cards = [
        { icon: '👥', label: 'Total Users', value: d.totalUsers, color: 'blue' },
        { icon: '🔧', label: 'Employees', value: d.totalEmployees, color: 'purple' },
        { icon: '📋', label: 'Service Requests', value: d.totalServices, color: 'orange' },
        { icon: '💬', label: 'Feedbacks', value: d.totalFeedbacks, color: 'teal' },
    ];

    const statusCards = [
        { label: 'Pending', value: d.servicesByStatus?.pending, color: 'yellow' },
        { label: 'Approved', value: d.servicesByStatus?.approved, color: 'green' },
        { label: 'Rejected', value: d.servicesByStatus?.rejected, color: 'red' },
    ];

    return (
        <div className="dashboard">
            {/* Header */}
            <div className="dashboard__header">
                <div>
                    <h1 className="dashboard__title">Dashboard</h1>
                    <p className="dashboard__subtitle">Overview of Fix Buddy activity</p>
                </div>
                <span className="dashboard__date">
                    {new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}
                </span>
            </div>

            {error && <div className="dashboard__error">⚠️ {error}</div>}

            {/* Main stat cards */}
            <div className="stat-grid">
                {cards.map((c) => (
                    <StatCard key={c.label} {...c} loading={loading} />
                ))}
            </div>

            {/* Service status breakdown */}
            <h2 className="section-title">Service Request Status</h2>
            <div className="status-grid">
                {statusCards.map((s) => (
                    <div key={s.label} className={`status-card status-card--${s.color}`}>
                        <span className="status-card__label">{s.label}</span>
                        <span className="status-card__value">{loading ? '—' : s.value ?? 0}</span>
                    </div>
                ))}
            </div>

            {/* Recent service requests */}
            <h2 className="section-title">Recent Service Requests</h2>
            <div className="table-wrapper">
                <table className="recent-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Service</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={5} className="table-empty">Loading…</td></tr>
                        ) : d.recentServices?.length ? (
                            d.recentServices.map((req, i) => (
                                <tr key={req._id}>
                                    <td>{i + 1}</td>
                                    <td>{req.name}</td>
                                    <td>{req.service}</td>
                                    <td>{new Date(req.createdAt).toLocaleDateString('en-IN')}</td>
                                    <td>
                                        <span className={`badge ${statusColor(req.status)}`}>{req.status}</span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan={5} className="table-empty">No requests yet</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;