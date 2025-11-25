import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";

// Layouts
import AdminLayout from "./layout/AdminLayout";
import HRLayout from "./layout/HRLayout";
import EmployeeLayout from "./layout/EmployeeLayout";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import RolesList from "./pages/admin/RolesList";
import AdminProfile from "./pages/admin/AdminProfile";

// HR Pages
import EmployeeList from "./pages/hr/EmployeeList";
import HRDashboard from "./pages/hr/HRDashboard";

// Employee Page
import EmployeeProfile from "./pages/employee/EmployeeProfile";
import AttendanceHR from "./pages/hr/AttendanceHR";
import AttendanceEmployee from "./pages/employee/AttendanceEmployee";

// Protected Components
import RequireAdmin from "./components/RequireAdmin";
import RequireHR from "./components/RequireHR";
import RequireEmployee from "./components/RequireEmployee";
import PayrollHR from "./pages/hr/PayrollHR";
import MyPayslips from "./pages/employee/MyPayslips";

const ForgotPassword = () => <h1>Forgot Password Page</h1>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* ===================== ADMIN ROUTES ===================== */}
        <Route
          path="/admin/dashboard"
          element={
            <RequireAdmin>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </RequireAdmin>
          }
        />

        <Route
          path="/admin/users"
          element={
            <RequireAdmin>
              <AdminLayout>
                <ManageUsers />
              </AdminLayout>
            </RequireAdmin>
          }
        />

        <Route
          path="/admin/roles"
          element={
            <RequireAdmin>
              <AdminLayout>
                <RolesList />
              </AdminLayout>
            </RequireAdmin>
          }
        />

        <Route
          path="/admin/profile"
          element={
            <RequireAdmin>
              <AdminLayout>
                <AdminProfile />
              </AdminLayout>
            </RequireAdmin>
          }
        />

        {/* ===================== HR ROUTES ===================== */}
        <Route
          path="/hr/employees"
          element={
            <RequireHR>
              <HRLayout>
                <EmployeeList />
              </HRLayout>
            </RequireHR>
          }
        />

        <Route
          path="/hr/dashboard"
          element={
            <RequireHR>
              <HRLayout>
                <HRDashboard />
              </HRLayout>
            </RequireHR>
          }
        />
<Route
  path="/hr/attendance"
  element={
    <RequireHR>
      <HRLayout>
        <AttendanceHR />
      </HRLayout>
    </RequireHR>
  }
/>

<Route
  path="/hr/payroll"
  element={
    <RequireHR>
      <HRLayout>
        <PayrollHR />
      </HRLayout>
    </RequireHR>
  }
/>
{/* ===================== EMPLOYEE ROUTES ===================== */}
<Route
  path="/employee"
  element={
    <RequireEmployee>
      <EmployeeLayout />
    </RequireEmployee>
  }
>
  <Route index element={<EmployeeProfile />} />

  <Route path="profile" element={<EmployeeProfile />} />
  <Route path="attendance" element={<AttendanceEmployee />} />
  <Route path="payslips" element={<MyPayslips />} />
</Route>


      </Routes>
    </BrowserRouter>
  );
}

export default App;
