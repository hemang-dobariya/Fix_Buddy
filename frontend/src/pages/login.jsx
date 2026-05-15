import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

// ICONS

const IconUser = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);

const IconMail = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m2 7 10 7 10-7" />
  </svg>
);

const IconLock = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

function Field({
  label,
  name,
  type = "text",
  placeholder,
  icon,
  value,
  onChange
}) {
  return (
    <div className="field">
      <label>{label}</label>

      <div className="input-wrap">
        <span className="input-icon">{icon}</span>

        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required
        />
      </div>
    </div>
  );
}

export default function AuthPage() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");

  const [status, setStatus] = useState("");

  const [loading, setLoading] = useState(false);

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: ""
  });

  const [regForm, setRegForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const isLogin = mode === "login";

  // LOGIN

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);

    setStatus("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify(loginForm)
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));

        setStatus("Login successful");

        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        setStatus(data.message);
      }
    } catch (error) {
      console.log(error);

      setStatus("Server error");
    }

    setLoading(false);
  };

  // REGISTER

  const handleRegister = async (e) => {
    e.preventDefault();

    setLoading(true);

    setStatus("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify(regForm)
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("Registered successfully");

        setTimeout(() => {
          setMode("login");
        }, 1200);
      } else {
        setStatus(data.message);
      }
    } catch (error) {
      console.log(error);

      setStatus("Server error");
    }

    setLoading(false);
  };

  return (
    <div className="page">

      {/* LEFT PANEL */}

      <div className="left-panel">

        <div className="brand">

          <div className="logo-icon">
            🔧
          </div>

          <h1>FixBuddy</h1>

        </div>

        <div className="left-content">

          <h2>
            {isLogin
              ? "Welcome Back!"
              : "Create Your Account"}
          </h2>

          <p>
            Book trusted home services instantly with
            India's smart repair platform.
          </p>

          <div className="floating-icons">
            <span>⚡</span>
            <span>🧹</span>
            <span>🚿</span>
            <span>❄️</span>
          </div>

        </div>

      </div>

      {/* RIGHT PANEL */}

      <div className="right-panel">

        <div className={`form-card ${!isLogin ? "register-mode" : ""}`}>

          <div className="mobile-logo">
            🔧 FixBuddy
          </div>

          <h2>
            {isLogin ? "Login" : "Register"}
          </h2>

          <p className="sub-text">
            {isLogin
              ? "Access your FixBuddy account"
              : "Join FixBuddy today"}
          </p>

          {status && (
            <p className="status">
              {status}
            </p>
          )}

          {isLogin ? (

            <form onSubmit={handleLogin}>

              <Field
                label="Email"
                name="email"
                type="email"
                placeholder="Enter email"
                icon={<IconMail />}
                value={loginForm.email}
                onChange={(e) =>
                  setLoginForm({
                    ...loginForm,
                    email: e.target.value
                  })
                }
              />

              <Field
                label="Password"
                name="password"
                type="password"
                placeholder="Enter password"
                icon={<IconLock />}
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm({
                    ...loginForm,
                    password: e.target.value
                  })
                }
              />

              <button className="submit-btn">
                {loading ? "Loading..." : "Login"}
              </button>

            </form>

          ) : (

            <form onSubmit={handleRegister}>

              <Field
                label="Name"
                name="name"
                placeholder="Enter name"
                icon={<IconUser />}
                value={regForm.name}
                onChange={(e) =>
                  setRegForm({
                    ...regForm,
                    name: e.target.value
                  })
                }
              />

              <Field
                label="Email"
                name="email"
                type="email"
                placeholder="Enter email"
                icon={<IconMail />}
                value={regForm.email}
                onChange={(e) =>
                  setRegForm({
                    ...regForm,
                    email: e.target.value
                  })
                }
              />

              <Field
                label="Password"
                name="password"
                type="password"
                placeholder="Enter password"
                icon={<IconLock />}
                value={regForm.password}
                onChange={(e) =>
                  setRegForm({
                    ...regForm,
                    password: e.target.value
                  })
                }
              />

              <button className="submit-btn">
                {loading ? "Loading..." : "Register"}
              </button>

            </form>

          )}

          <p className="toggle-text">

            {isLogin
              ? "No account?"
              : "Already have account?"}

            <button
              className="toggle-btn"
              onClick={() =>
                setMode(
                  isLogin ? "register" : "login"
                )
              }
            >
              {isLogin ? " Register" : " Login"}
            </button>

          </p>

        </div>
      </div>
    </div>
  );
}