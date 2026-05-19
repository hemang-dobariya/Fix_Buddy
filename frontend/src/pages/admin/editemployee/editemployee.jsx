import { useState, useEffect } from "react";
import "../addEmployee/addEmployee.css"; // reuse same CSS
import { useNavigate, useParams } from "react-router-dom";

const DEPARTMENTS = ["AC Fitting", "Home Cleaning", "Plumber", "Electrician"];

export default function EditEmployeeForm({
  apiBase = "http://localhost:5000/api/employee",
}) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    department: "",
  });
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch existing employee data
  useEffect(() => {
    async function fetchEmployee() {
      try {
        const res = await fetch(`${apiBase}/${id}`);
        const data = await res.json();
        if (!res.ok) {
          setErrorMsg(data.message || "Failed to load employee.");
          return;
        }
        const { name, email, password, phone, department } = data.data;
        setForm({
          name,
          email,
          password: password || "",
          phone: phone || "",
          department: department || "",
        });
      } catch {
        setErrorMsg("Network error. Could not load employee.");
      } finally {
        setLoading(false);
      }
    }
    fetchEmployee();
  }, [id, apiBase]);

  const disabled = status === "pending" || status === "success";

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handlePhone = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
    setForm((f) => ({ ...f, phone: val }));
  };

  function handleReset() {
    setStatus("idle");
    setErrorMsg("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("pending");
    setErrorMsg("");

    // Build payload — omit password if left blank
    const payload = { ...form };
    if (!payload.password) delete payload.password;

    try {
      const res = await fetch(`${apiBase}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.message || "Something went wrong.");
        setStatus("error");
        return;
      }
      navigate("/admin/employees");
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  if (loading) {
    return (
      <div className="aef-card">
        <div className="aef-header">
          <h1 className="aef-title">Edit Employee</h1>
          <p className="aef-subtitle">Loading employee details…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="aef-card">
      <div className="aef-header">
        <h1 className="aef-title">Edit Employee</h1> {/* ← changed */}
        <p className="aef-subtitle">
          Update the details for this team member.
        </p>{" "}
        {/* ← changed */}
      </div>

      <form className="aef-form" onSubmit={handleSubmit} noValidate>
        <section className="aef-section">
          <h2 className="aef-section-title">Identity</h2>
          <div className="aef-row">
            <Field
              label="Full Name"
              required
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Priya Sharma"
              disabled={disabled}
            />
            <Field
              label="Email"
              required
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="priya@company.com"
              disabled={disabled}
            />
          </div>
          <div className="aef-row">
            <Field
              label="New Password" // ← label changed; leave blank to keep old
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Leave blank to keep current" // ← placeholder changed
              disabled={disabled}
            />
            <div className="aef-field">
              <label className="aef-label">Phone</label>
              <input
                className="aef-input"
                name="phone"
                type="tel"
                inputMode="numeric"
                value={form.phone}
                onChange={handlePhone}
                placeholder="10-digit number"
                maxLength={10}
                disabled={disabled}
              />
            </div>
          </div>
        </section>

        <section className="aef-section">
          <h2 className="aef-section-title">Role & Department</h2>
          <div className="aef-row">
            <SelectField
              label="Department"
              name="department"
              value={form.department}
              onChange={handleChange}
              options={DEPARTMENTS}
              disabled={disabled}
            />
          </div>
        </section>

        {status === "error" && errorMsg && (
          <div className="aef-banner aef-banner--error">⚠ {errorMsg}</div>
        )}

        <div className="aef-footer">
          <button
            type="button"
            className="aef-btn aef-btn--ghost"
            disabled={disabled}
            onClick={handleReset}
          >
            Reset
          </button>
          <button
            type="submit"
            className={`aef-btn aef-btn--primary aef-btn--${status}`}
            disabled={disabled}
          >
            {status === "pending" && <span className="aef-spinner" />}
            {status === "success"
              ? "✓ Saved"
              : status === "pending"
                ? "Saving…"
                : "Save Changes"}{" "}
            {/* ← labels changed */}
          </button>
        </div>
      </form>
    </div>
  );
}

// ── Field & SelectField are identical to addEmployee.jsx ──
function Field({ label, required, ...props }) {
  return (
    <div className="aef-field">
      <label className="aef-label">
        {label}
        {required && <span className="aef-required"> *</span>}
      </label>
      <input className="aef-input" {...props} />
    </div>
  );
}

function SelectField({ label, options, ...props }) {
  return (
    <div className="aef-field">
      <label className="aef-label">{label}</label>
      <select className="aef-input aef-select" {...props}>
        <option value="">— Select —</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
