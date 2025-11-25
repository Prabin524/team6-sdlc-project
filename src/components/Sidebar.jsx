import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import SettingsIcon from "@mui/icons-material/Settings";
import PeopleIcon from "@mui/icons-material/People";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import PaymentsIcon from "@mui/icons-material/Payments";

const drawerWidth = 240;

const Sidebar = ({ role = "admin" }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  let menuItems = [];

  // ======================= ADMIN MENU =======================
  if (role === "admin") {
    menuItems = [
      { text: "Dashboard", icon: <DashboardIcon />, path: "/admin/dashboard" },
      { text: "Manage Users", icon: <GroupIcon />, path: "/admin/users" },
      { text: "Roles", icon: <SettingsIcon />, path: "/admin/roles" },
      { text: "Employees", icon: <PeopleIcon />, path: "/admin/employees" },
      { text: "Attendance", icon: <AccessTimeIcon />, path: "/admin/attendance" },
      { text: "Settings", icon: <SettingsIcon />, path: "/admin/settings" },
      { text: "Profile", icon: <PersonIcon />, path: "/admin/profile" },
    ];
  }

  // ======================= HR MENU =======================
  if (role === "hr") {
    menuItems = [
      { text: "Dashboard", icon: <DashboardIcon />, path: "/hr/dashboard" },
      { text: "Employees", icon: <PeopleIcon />, path: "/hr/employees" },
      { text: "Attendance", icon: <AccessTimeIcon />, path: "/hr/attendance" },
      { text: "Profile", icon: <PersonIcon />, path: "/hr/profile" },
    ];
  }

  // ======================= EMPLOYEE MENU =======================
  if (role === "employee") {
    menuItems = [
      { text: "Dashboard", icon: <DashboardIcon />, path: "/employee/dashboard" },
      { text: "My Profile", icon: <PersonIcon />, path: "/employee/profile" },
      { text: "My Payslips", icon: <PaymentsIcon />, path: "/employee/payslips" }, // 
    ];
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar />

      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => navigate(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}

        {/* Logout */}
        <ListItem disablePadding sx={{ mt: 2 }}>
          <ListItemButton
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
