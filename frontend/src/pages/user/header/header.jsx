import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Header() {
  const [isLogin, setIsLogin] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem("user");
      setIsLogin(!!user);
    };

    checkAuth();

    window.addEventListener("storage", checkAuth);
    window.addEventListener("authChange", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("authChange", checkAuth);
    };
  }, []);

  const handleAuth = () => {
    if (isLogin) {
      // LOGOUT
      localStorage.removeItem("user");
      setIsLogin(false);
      window.dispatchEvent(new Event("authChange"));
      navigate("/login");
    } else {
      // LOGIN PAGE
      navigate("/login");
    }
  };

  return (
    <header className="header">
      <div className="logo">🔧 FixBuddy</div>

      <nav>
        <Link to="/">Home</Link>
        <Link to="/services">Services</Link>
        <Link to="/about">About Us</Link>
        <Link to="/contact">Contact Us</Link>
      </nav>

      <button className="login-btn" onClick={handleAuth}>
        {isLogin ? "Logout" : "Login"}
      </button>
    </header>
  );
}

export default Header;