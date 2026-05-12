import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Header() {
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="logo">
        🔧 FixBuddy
      </div>

      <nav>
        <Link to="/">Home</Link>
        <Link to="/services">Services</Link>
        <Link to="/about">About Us</Link>
        <Link to="/contact">Contact Us</Link>
      </nav>

      <button
        className="login-btn"
        onClick={() => navigate("/login") }
        // onClick={() => setIsLogin(!isLogin)}
      >
        {/* {isLogin ? "Logout" : "Login"} */}
        Login

      </button>
    </header>
  );
}

export default Header;