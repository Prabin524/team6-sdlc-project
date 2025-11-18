import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminLayout from "./layout/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import RequireAdmin from "./components/RequireAdmin";
import RolesList from "./pages/admin/RolesList";
import HRDashboard from "./pages/hr/HRDashboard";
import AdminProfile from "./pages/admin/AdminProfile";

const ForgotPassword = () => <h1>Forgot Password Page</h1>;
const Employees = () => <h1>Employees (Coming Soon)</h1>;
const Attendance = () => <h1>Attendance (Coming Soon)</h1>;
const Settings = () => <h1>Settings (Coming Soon)</h1>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Admin Routes with layout */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
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
          path="/admin/employees"
          element={
            <AdminLayout>
              <Employees />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/attendance"
          element={
            <AdminLayout>
              <Attendance />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <AdminLayout>
              <Settings />
            </AdminLayout>
          }
        />
        <Route
  path="/hr/dashboard"
  element={
    <AdminLayout>
      <HRDashboard />
    </AdminLayout>
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
  

      </Routes>
    </BrowserRouter>
  );
}

export default App;
