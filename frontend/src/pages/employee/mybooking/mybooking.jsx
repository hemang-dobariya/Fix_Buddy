import React, { useEffect, useState, useCallback } from "react";
import "./mybooking.css";
import { Check, X } from "lucide-react";

const formatDate = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (time) => {
  if (!time) return "N/A";
  try {
    const [hours, minutes] = time.split(":").slice(0, 2);
    const h = parseInt(hours);
    const m = parseInt(minutes);
    const period = h >= 12 ? "PM" : "AM";
    const displayHour = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${displayHour}:${String(m).padStart(2, "0")} ${period}`;
  } catch {
    return time;
  }
};

function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const buildPages = () => {
    const items = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
        items.push(i);
      } else if (i === page - 2 || i === page + 2) {
        items.push("...");
      }
    }
    return items.filter((v, i, a) => !(v === "..." && a[i - 1] === "..."));
  };

  return (
    <div className="mb-pagination" role="navigation" aria-label="Pagination">
      <button
        className="mb-page-btn"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        ←
      </button>

      {buildPages().map((item, idx) =>
        item === "..." ? (
          <span key={`e${idx}`} className="mb-ellipsis">
            …
          </span>
        ) : (
          <button
            key={item}
            className={`mb-page-btn ${item === page ? "active" : ""}`}
            onClick={() => onPageChange(item)}
            aria-current={item === page ? "page" : undefined}
          >
            {item}
          </button>
        ),
      )}

      <button
        className="mb-page-btn"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        →
      </button>
    </div>
  );
}

const MyBooking = () => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [department, setDepartment] = useState("");
  const [loadingDept, setLoadingDept] = useState(true);

  // Get employee email from localStorage and fetch department
  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const employeeEmail = localStorage.getItem("employeeEmail");
        
        if (!employeeEmail) {
          setError("Employee email not found");
          setLoadingDept(false);
          return;
        }

        const res = await fetch(
          `http://localhost:5000/api/employee/email/${encodeURIComponent(employeeEmail)}`,
        );
        
        if (!res.ok) throw new Error("Failed to fetch employee details");
        
        const json = await res.json();
        if (json.success && json.data.department) {
          setDepartment(json.data.department);
        } else {
          setError("Department not found for this employee");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingDept(false);
      }
    };

    fetchEmployeeDetails();
  }, []);

  const fetchServices = useCallback(async () => {
    if (!department || loadingDept) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `http://localhost:5000/api/services/department/${encodeURIComponent(department)}`,
      );
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const json = await res.json();

      // Calculate pagination
      const total = json.data?.length ?? 0;
      const startIndex = (page - 1) * limit;
      const paginatedData = json.data?.slice(
        startIndex,
        startIndex + limit,
      ) ?? [];

      setData(paginatedData);
      setPagination({
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, limit, department, loadingDept]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setPage(1);
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/services/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      // Update local state
      setData((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, status: newStatus } : item,
        ),
      );

      // Refresh list
      fetchServices();
    } catch (err) {
      console.log(err);
    }
  };

  const startRow =
    pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
  const endRow = Math.min(pagination.page * pagination.limit, pagination.total);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Approved":
        return "mb-badge-approved";
      case "Rejected":
        return "mb-badge-rejected";
      default:
        return "mb-badge-pending";
    }
  };

  return (
    <div className="mb-wrapper">
      {/* Header */}
      <div className="mb-header">
        <div>
          <p className="mb-eyebrow">// My Bookings</p>
          <h1 className="mb-title">Service Requests</h1>
          <p className="mb-subtitle">
            {department ? `Manage ${department} service booking requests` : "Loading your department..."}
          </p>
        </div>
        <div className="mb-stat">
          <span className="mb-stat-number">{pagination.total}</span>
          <span className="mb-stat-label">
            Pending
            <br />
            Requests
          </span>
        </div>
      </div>

      {/* Check if department is loaded */}
      {loadingDept ? (
        <div className="mb-card">
          <div className="mb-state">
            <div className="mb-spinner" />
            <p className="mb-state-title">Loading your department…</p>
          </div>
        </div>
      ) : !department ? (
        <div className="mb-card">
          <div className="mb-state">
            <div className="mb-state-icon">⚠️</div>
            <p className="mb-state-title">Department Not Found</p>
            <p className="mb-state-sub">
              Unable to load your department information. Please logout and login again.
            </p>
          </div>
        </div>
      ) : (
        <div className="mb-card">
        <div className="mb-table-scroll">
          <table className="mb-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Service</th>
                <th>Date & Time</th>
                <th>Location</th>
                <th>Phone</th>
                <th>Status</th>
                <th className="mb-action">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={7}>
                    <div className="mb-state">
                      <div className="mb-spinner" />
                      <p className="mb-state-title">Loading bookings…</p>
                    </div>
                  </td>
                </tr>
              )}

              {!loading && error && (
                <tr>
                  <td colSpan={7}>
                    <div className="mb-state">
                      <div className="mb-state-icon">⚠️</div>
                      <p className="mb-state-title">Failed to load</p>
                      <p className="mb-state-sub">{error}</p>
                    </div>
                  </td>
                </tr>
              )}

              {!loading && !error && data.length === 0 && (
                <tr>
                  <td colSpan={7}>
                    <div className="mb-state">
                      <div className="mb-state-icon">📋</div>
                      <p className="mb-state-title">No bookings found</p>
                      <p className="mb-state-sub">
                        Your service requests will appear here
                      </p>
                    </div>
                  </td>
                </tr>
              )}

              {!loading &&
                !error &&
                data.map((item, idx) => (
                  <tr key={item._id}>
                    <td>
                      <span className="mb-id-small">{startRow + idx}</span>
                    </td>
                    <td>
                      <span className="mb-service-name">{item.service}</span>
                    </td>
                    <td>
                      <div className="mb-date-time">
                        <span className="mb-date">
                          {formatDate(item.date)}
                        </span>
                        <span className="mb-time">
                          {formatTime(item.time)}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="mb-location">{item.address}</span>
                    </td>
                    <td>
                      <span className="mb-phone">{item.phone}</span>
                    </td>
                    <td>
                      <span className={`mb-badge ${getStatusBadgeClass(item.status)}`}>
                        <span className="mb-badge-dot" />
                        {item.status}
                      </span>
                    </td>
                    <td>
                      {item.status === "Approved" ? (
                        <div className="mb-action">
                          <span className="mb-action-approved-chip">
                            <Check size={14} />
                            Approved
                          </span>
                        </div>
                      ) : (
                        <div className="mb-action">
                          <button
                            className="mb-approve-btn"
                            onClick={() =>
                              handleStatusUpdate(item._id, "Approved")
                            }
                            disabled={item.status !== "Pending"}
                            title="Approve booking"
                          >
                            <Check size={18} />
                          </button>
                          <button
                            className="mb-reject-btn"
                            onClick={() =>
                              handleStatusUpdate(item._id, "Rejected")
                            }
                            disabled={item.status !== "Pending"}
                            title="Reject booking"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mb-footer">
          <div className="mb-footer-left">
            {!loading && !error && data.length > 0 && (
              <span className="mb-page-info">
                {startRow}–{endRow} of {pagination.total} bookings
              </span>
            )}
            <span className="mb-limit-label">Show</span>
            <select
              className="mb-limit-select"
              value={limit}
              onChange={handleLimitChange}
            >
              {[5, 10, 25, 50].map((n) => (
                <option key={n} value={n}>
                  {n} rows
                </option>
              ))}
            </select>
          </div>

          {!loading && !error && data.length > 0 && (
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={(p) => setPage(p)}
            />
          )}
        </div>
        </div>
      )}
    </div>
  );
};

export default MyBooking;