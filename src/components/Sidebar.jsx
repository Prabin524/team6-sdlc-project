import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const navigate = useNavigate();

  // ✅ Read logged-in user directly
  const { user } = useAuth();
  const role = user?.role;

  // Menus
  const adminMenu = [
    { text: "Dashboard", path: "/admin/dashboard" },
    { text: "Manage Users", path: "/admin/users" },
    { text: "Roles", path: "/admin/roles" },
    { text: "Admin Profile", path: "/admin/profile" },
  ];

  const hrMenu = [
    { text: "Dashboard", path: "/hr/dashboard" },
    { text: "Employee List", path: "/hr/employees" },
    { text: "Attendance", path: "/hr/attendance" },
    { text: "Payroll", path: "/hr/payroll" },
  ];

  const employeeMenu = [
    { text: "My Profile", path: "/employee/profile" },
    { text: "My Attendance", path: "/employee/attendance" },
    { text: "My Payslips", path: "/employee/payslips" },
  ];

  // Role selector
  let menu = [];
  if (role === "admin") menu = adminMenu;
  else if (role === "hr") menu = hrMenu;
  else menu = employeeMenu;

  return (
    <Drawer variant="permanent" anchor="left" sx={{ width: 240 }}>
      <List>
        {menu.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => navigate(item.path)}>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
