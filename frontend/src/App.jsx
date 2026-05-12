import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from "./pages/header/header";
import Footer from "./pages/footer/footer";
import Home from "./pages/Home/home";
import Login from "./pages/login";
import "./App.css";

function Layout() {
  const location = useLocation();
  const hideLayout = location.pathname === "/login";

  return (
    <>
      {!hideLayout && <Header />}

      <div className={hideLayout ? "" : "main-content"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>

      {!hideLayout && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;