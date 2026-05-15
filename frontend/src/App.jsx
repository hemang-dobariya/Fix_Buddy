import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from "./pages/user/header/header";
import Footer from "./pages/user/footer/footer";
import Home from "./pages/user/Home/home";
import Login from "./pages/login";
import "./App.css";
import AboutUs from "./pages/user/Home/aboutus";
import ContactUs from "./pages/user/home/contectus";
import Services from "./pages/user/home/service";

function Layout() {
  const location = useLocation();
  const hideLayout = location.pathname === "/login";

  return (
    <>
      {!hideLayout && <Header />}

      <div className={hideLayout ? "" : "main-content"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/services" element={<Services />} />
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