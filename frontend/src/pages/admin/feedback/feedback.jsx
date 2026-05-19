import React, { useEffect, useState, useCallback } from "react";
import "./Feedback.css";
import "../employee/employee.css";
import { Trash2 } from "lucide-react";

const formatDate = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

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
    <div className="emp-pagination" role="navigation" aria-label="Pagination">
      <button
        className="emp-page-btn"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        ←
      </button>

      {buildPages().map((item, idx) =>
        item === "..." ? (
          <span key={`e${idx}`} className="emp-ellipsis">
            …
          </span>
        ) : (
          <button
            key={item}
            className={`emp-page-btn ${item === page ? "active" : ""}`}
            onClick={() => onPageChange(item)}
            aria-current={item === page ? "page" : undefined}
          >
            {item}
          </button>
        ),
      )}

      <button
        className="emp-page-btn"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        →
      </button>
    </div>
  );
}

const Feedback = () => {
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
  const [open, setOpen] = useState(null);

  const fetchFeedbacks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `http://localhost:5000/api/feedback?page=${page}&limit=${limit}`,
      );
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const json = await res.json();
      setData(json.data ?? []);
      setPagination(
        json.pagination ?? { page, limit, total: 0, totalPages: 1 },
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setPage(1);
  };

  const startRow =
    pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
  const endRow = Math.min(pagination.page * pagination.limit, pagination.total);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/feedback/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete Feedback");

      setData((prev) => prev.filter((u) => u._id !== id));
      setOpen(null);
      fetchFeedbacks();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="emp-wrapper">
      {/* Header */}
      <div className="emp-header">
        <div>
          <p className="emp-eyebrow">// Directory</p>
          <h1 className="emp-title">Feedbacks</h1>
          <p className="emp-subtitle">Manage your organisation's Feedbacks</p>
        </div>
        <div className="emp-stat">
          <span className="emp-stat-number">{pagination.total}</span>
          <span className="emp-stat-label">
            Total
            <br />
            Feedbacks
          </span>
        </div>
      </div>

      {/* Table Card */}
      <div className="emp-card">
        <div className="emp-table-scroll">
          <table className="emp-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Message</th>
                <th>Date</th>
                <th className="emp-th-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={6}>
                    <div className="emp-state">
                      <div className="emp-spinner" />
                      <p className="emp-state-title">Loading Feedbacks…</p>
                    </div>
                  </td>
                </tr>
              )}

              {!loading && error && (
                <tr>
                  <td colSpan={6}>
                    <div className="emp-state">
                      <div className="emp-state-icon">⚠️</div>
                      <p className="emp-state-title">Failed to load</p>
                      <p className="emp-state-sub">{error}</p>
                    </div>
                  </td>
                </tr>
              )}

              {!loading && !error && data.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <div className="emp-state">
                      <div className="emp-state-icon">👤</div>
                      <p className="emp-state-title">No Feedbacks found</p>
                      <p className="emp-state-sub">
                        No Feedbacks registered yet
                      </p>
                    </div>
                  </td>
                </tr>
              )}

              {!loading &&
                !error &&
                data.map((Feedback, idx) => (
                  <tr key={Feedback._id}>
                    <td>
                      <span className="emp-id-small">{startRow + idx}</span>
                    </td>
                    <td>
                      <div className="emp-name-cell">
                        <div className="emp-avatar">
                          {getInitials(Feedback.name)}
                        </div>
                        <div>
                          <div className="emp-name-text">{Feedback.name}</div>
                          <div className="emp-id-small">
                            {Feedback._id.slice(-8)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="emp-email">{Feedback.email}</span>
                    </td>
                    <td>
                      <span
                        className="feedback-message"
                        title={Feedback.message}
                      >
                        {Feedback.message}
                      </span>
                    </td>
                    <td>
                      <span className="emp-date">
                        {formatDate(Feedback.createdAt)}
                      </span>
                    </td>
                    <td>
                      <div className="emp-action">
                        <button
                          className="emp-delete"
                          onClick={() => setOpen(Feedback._id)}
                        >
                          <Trash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="emp-footer">
          <div className="emp-footer-left">
            {!loading && !error && data.length > 0 && (
              <span className="emp-page-info">
                {startRow}–{endRow} of {pagination.total} Feedbacks
              </span>
            )}
            <span className="emp-limit-label">Show</span>
            <select
              className="emp-limit-select"
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

      {/* Delete Confirmation Modal */}
      {open && (
        <div className="emp-modal-overlay">
          <div className="emp-modal">
            <div className="emp-modal-icon">
              <Trash2 size={34} />
            </div>
            <h2 className="emp-modal-title">Delete Feedback?</h2>
            <p className="emp-modal-text">
              Are you sure you want to delete this Feedback?
              <br />
              This action cannot be undone.
            </p>
            <div className="emp-modal-actions">
              <button
                className="emp-modal-cancel"
                onClick={() => setOpen(null)}
              >
                Cancel
              </button>
              <button
                className="emp-modal-delete"
                onClick={() => handleDelete(open)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feedback;
