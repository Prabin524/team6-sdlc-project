import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  CssBaseline,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import LogoutIcon from "@mui/icons-material/Logout";

import { useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const drawerWidth = 240;

const EmployeeLayout = ({ children }) => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Load user from localStorage ONLY for display (not setUser)
  useEffect(() => {
    // If your AuthContext already loads the user, nothing needed here.
  }, []);

  if (!user) {
    return (
      <Typography variant="h6" sx={{ mt: 10, ml: 3 }}>
        Loading profile...
      </Typography>
    );
  }

  const menuItems = [
    { text: "My Profile", icon: <PersonIcon />, path: "/employee/profile" },
    { text: "Attendance", icon: <AccessTimeIcon />, path: "/employee/attendance" },
    { text: "My Payslips", icon: <ReceiptLongIcon />, path: "/employee/payslips" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      <CssBaseline />

      <AppBar position="fixed" sx={{ zIndex: 1201 }}>
        <Toolbar>
          <IconButton color="inherit" onClick={() => setOpen(!open)} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Welcome, {user.fullname} – {user.role.toUpperCase()}
          </Typography>

          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: open ? drawerWidth : 72,
          "& .MuiDrawer-paper": {
            width: open ? drawerWidth : 72,
            transition: "0.3s",
          },
        }}
      >
        <Toolbar />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton onClick={() => navigate(item.path)}
                sx={{ justifyContent: open ? "initial" : "center" }}
              >
                <ListItemIcon sx={{ justifyContent: "center" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}

          <ListItem disablePadding sx={{ mt: 3 }}>
            <ListItemButton onClick={handleLogout}
              sx={{ justifyContent: open ? "initial" : "center" }}
            >
              <ListItemIcon sx={{ justifyContent: "center" }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          ml: open ? `${drawerWidth}px` : "72px",
          mt: 8,
          p: 3,
          transition: "margin 0.3s",
          background: "#f5f5f5",
          minHeight: "100vh",
        }}
      >
        {children || <Outlet />}
      </Box>
    </Box>
  );
};

export default EmployeeLayout;
