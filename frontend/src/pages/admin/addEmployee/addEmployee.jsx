import { useState } from "react";
import "./addEmployee.css";
import { useNavigate } from "react-router-dom";

const DEPARTMENTS = ["AC Fitting", "Home Cleaning", "Plumber", "Electrician"];

export default function AddEmployeeForm({
  apiBase = "http://localhost:5000/api/employee",
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    department: "",
  });
  const navigate = useNavigate();
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const disabled = status === "pending" || status === "success";

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handlePhone = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
    setForm((f) => ({ ...f, phone: val }));
  };

  function handleReset() {
    setForm({ name: "", email: "", password: "", phone: "", department: "" });
    setStatus("idle");
    setErrorMsg("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("pending");
    setErrorMsg("");
    // 3. Replace the entire try block
    try {
      const res = await fetch(apiBase, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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

  return (
    <div className="aef-card">
      <div className="aef-header">
        <h1 className="aef-title">Add Employee</h1>
        <p className="aef-subtitle">
          Fill in the details to onboard a new team member.
        </p>
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
              label="Password"
              required
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Min. 6 characters"
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
        {status === "success" && (
          <div className="aef-banner aef-banner--success">
            ✓ Employee added successfully!
          </div>
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
              ? "✓ Employee Added"
              : status === "pending"
                ? "Submitting…"
                : "+ Add Employee"}
          </button>
        </div>
      </form>
    </div>
  );
}

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
