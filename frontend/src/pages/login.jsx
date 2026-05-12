import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

// icons
const IconUser = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);

const IconMail = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m2 7 10 7 10-7" />
  </svg>
);

const IconLock = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
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
        navigate("/home");
      } else {
        setStatus(data.message);
      }
    } catch {
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
        navigate("/home");
      } else {
        setStatus(data.message);
      }
    } catch {
      setStatus("Server error");
    }

    setLoading(false);
  };

  return (
    <div className="page">
      <div className="left-panel">
        <h1>Nexus</h1>
        <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
      </div>

      <div className="right-panel">
        <div className="form-card">
          <h2>{isLogin ? "Login" : "Register"}</h2>

          {status && <p className="status">{status}</p>}

          {isLogin ? (
            <form onSubmit={handleLogin}>
              <Field
                label="Email"
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
            {isLogin ? "No account?" : "Already have account?"}
            <button
              className="toggle-btn"
              onClick={() =>
                setMode(isLogin ? "register" : "login")
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