import React, { useState, useEffect } from 'react'
import './services.css'

const statusColors = {
  Pending: 'status--pending',
  Approved: 'status--approved',
  Rejected: 'status--rejected',
}

const avatarColors = [
  '#2563eb', '#7c3aed', '#db2777', '#059669', '#d97706', '#0284c7',
]

const getInitials = (name = '') =>
  name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

const getAvatarColor = (name = '') => {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return avatarColors[Math.abs(hash) % avatarColors.length]
}

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  const d = new Date(dateStr)
  return isNaN(d) ? dateStr : d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

const Services = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [page, setPage] = useState(1)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('http://localhost:5000/api/services')
      if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`)
      const data = await res.json()
      setServices(Array.isArray(data) ? data : data.data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 2800)
  }

  const handleAction = async (id, action) => {
    try {
      const res = await fetch(`http://localhost:5000/api/services/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: action }),
      })
      if (!res.ok) throw new Error('Update failed')
      setServices(prev =>
        prev.map(s => (s._id === id ? { ...s, status: action } : s))
      )
      showToast(
        `Service ${action === 'Approved' ? 'approved' : 'rejected'} successfully.`,
        action === 'Approved' ? 'success' : 'error'
      )
    } catch (err) {
      showToast('Action failed. Please try again.', 'error')
    }
  }

  const totalPages = Math.ceil(services.length / rowsPerPage)
  const paginated = services.slice((page - 1) * rowsPerPage, page * rowsPerPage)

  return (
    <div className="services-page">
      {/* Toast */}
      {toast && (
        <div className={`services-toast services-toast--${toast.type}`}>
          {toast.type === 'success' ? '✓' : '✗'} {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="services-header">
        <div>
          <div className="services-breadcrumb">// DIRECTORY</div>
          <h1 className="services-title">Services</h1>
          <p className="services-subtitle">Manage your organisation's service requests</p>
        </div>
        <div className="services-total-badge">
          <span className="services-total-num">{services.length}</span>
          <span className="services-total-label">Total<br />Requests</span>
        </div>
      </div>

      {/* Table Card */}
      <div className="services-card">
        {loading ? (
          <div className="services-state">
            <div className="services-spinner" />
            <p>Loading service requests...</p>
          </div>
        ) : error ? (
          <div className="services-state services-state--error">
            <p>⚠ {error}</p>
            <button className="services-retry-btn" onClick={fetchServices}>Retry</button>
          </div>
        ) : (
          <>
            <div className="services-table-wrapper">
              <table className="services-table">
                <thead>
                  <tr className="services-thead">
                    {['#', 'NAME', 'SERVICE', 'DATE & TIME', 'STATUS', 'DESCRIPTION', 'ACTIONS'].map(col => (
                      <th key={col} className="services-th">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="services-empty">No service requests found.</td>
                    </tr>
                  ) : (
                    paginated.map((item, idx) => (
                      <tr key={item._id} className="services-row">
                        <td className="services-td services-td--num">
                          {(page - 1) * rowsPerPage + idx + 1}
                        </td>

                        <td className="services-td">
                          <div className="services-name-cell">
                            <div
                              className="services-avatar"
                              style={{ background: getAvatarColor(item.name) }}
                            >
                              {getInitials(item.name)}
                            </div>
                            <div>
                              <div className="services-name">{item.name}</div>
                              <div className="services-email">{item.email}</div>
                            </div>
                          </div>
                        </td>

                        <td className="services-td">
                          <span className="services-service-badge">{item.service}</span>
                        </td>

                        <td className="services-td">
                          <div className="services-date">{formatDate(item.date)}</div>
                          <div className="services-time">{item.time || 'N/A'}</div>
                        </td>

                        <td className="services-td">
                          <span className={`services-status ${statusColors[item.status] || ''}`}>
                            <span className="services-status-dot" />
                            {item.status}
                          </span>
                        </td>

                        <td className="services-td services-td--desc">
                          <span className="services-desc" title={item.description}>
                            {item.description}
                          </span>
                        </td>

                        <td className="services-td">
                          <div className="services-actions">
                            <button
                              className="services-btn services-btn--approve"
                              onClick={() => handleAction(item._id, 'Approved')}
                              disabled={item.status === 'Approved'}
                            >
                              ✓ Approve
                            </button>
                            <button
                              className="services-btn services-btn--reject"
                              onClick={() => handleAction(item._id, 'Rejected')}
                              disabled={item.status === 'Rejected'}
                            >
                              ✕ Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="services-footer">
              <span className="services-footer-text">
                {services.length === 0
                  ? '0'
                  : `${(page - 1) * rowsPerPage + 1}–${Math.min(page * rowsPerPage, services.length)}`}{' '}
                of {services.length} requests &nbsp; Show
              </span>
              <select
                className="services-select"
                value={rowsPerPage}
                onChange={e => { setRowsPerPage(Number(e.target.value)); setPage(1) }}
              >
                {[5, 10, 20, 50].map(n => (
                  <option key={n} value={n}>{n} rows</option>
                ))}
              </select>

              {totalPages > 1 && (
                <div className="services-pagination">
                  <button
                    className="services-page-btn"
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                  >‹</button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      className={`services-page-btn ${page === i + 1 ? 'services-page-btn--active' : ''}`}
                      onClick={() => setPage(i + 1)}
                    >{i + 1}</button>
                  ))}
                  <button
                    className="services-page-btn"
                    disabled={page === totalPages}
                    onClick={() => setPage(p => p + 1)}
                  >›</button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Services