import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Header from "./pages/user/header/header";
import Footer from "./pages/user/footer/footer";
import Home from "./pages/user/Home/home";
import Login from "./pages/login";
import "./App.css";
import AboutUs from "./pages/user/Home/aboutus";
import ContactUs from "./pages/user/home/contectus";
import Services from "./pages/user/home/service";
import AppLayout from "./Layout/AppLayout/AppLayout"
import Dashboard from "./pages/admin/dashboard/dashboard"
import EmployeePage from "./pages/admin/employee/employee"
import AddEmployeeForm from "./pages/admin/addEmployee/addEmployee";
import ServicesPage from "./pages/admin/services/services";

import EmployeeDashboard from "./pages/employee/dashboard/dashboard"
import EditEmployeeForm from "./pages/admin/editemployee/editemployee";
import User from "./pages/admin/user/User";
import Feedback from "./pages/admin/feedback/feedback";
import MyBooking from "./pages/employee/mybooking/mybooking";
import EmployeeFeedback from "./pages/employee/feedback/feedback";

function Layout() {
  const location = useLocation();

  // Hide header/footer for login AND all admin routes
  const hideLayout =
    location.pathname === "/login" || location.pathname.startsWith("/admin") || location.pathname.startsWith("/employee");

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
          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <AppLayout>
                <Dashboard />
              </AppLayout>
            }
          />
          <Route
            path="/admin/employees"
            element={
              <AppLayout>
                <EmployeePage />
              </AppLayout>
            }
          />
          <Route
            path="/admin/employee/add-employee"
            element={
              <AppLayout>
                <AddEmployeeForm />
              </AppLayout>
            }
          />
          
          <Route
            path="/admin/employees/edit/:id"
            element={
              <AppLayout>
                <EditEmployeeForm />
              </AppLayout>
            }
          />
         
          <Route
            path="/admin/services"
            element={
              <AppLayout>
                <ServicesPage />
              </AppLayout>
            }
          />
          
          <Route
            path="/admin/users"
            element={
              <AppLayout>
                <User />
              </AppLayout>
            }
          />
          
          <Route
            path="/admin/feedback"
            element={
              <AppLayout>
                <Feedback />
              </AppLayout>
            }
          />

          {/* Employee Routes */}
          <Route
            path="/employee/dashboard"
            element={
              <AppLayout>
                <EmployeeDashboard />
              </AppLayout>
            }
          />
          <Route
            path="/employee/bookings"
            element={
              <AppLayout>
                <MyBooking />
              </AppLayout>
            }
          />
          <Route
            path="/employee/feedback"
            element={
              <AppLayout>
                <EmployeeFeedback />
              </AppLayout>
            }
          />
          
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
