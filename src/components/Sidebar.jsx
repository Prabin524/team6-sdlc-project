import React from "react";
import { Box, List, ListItem, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";

const Sidebar = ({ role }) => {
  const adminMenu = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Manage Users", path: "/admin/users" },
    { name: "Roles", path: "/admin/roles" },
    { name: "Employees", path: "/hr/employees" }, 
    { name: "Profile", path: "/admin/profile" },
  ];

  const hrMenu = [
    { name: "Dashboard", path: "/hr/dashboard" },
    { name: "Employees", path: "/hr/employees" },
  ];

  const employeeMenu = [
    { name: "My Profile", path: "/employee/profile" }
  ];

  let menu = [];

  if (role === "admin") menu = adminMenu;
  if (role === "hr") menu = hrMenu;
  if (role === "employee") menu = employeeMenu;

  return (
    <Box
      sx={{
        width: 220,
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
        pt: 2,
      }}
    >
      <List>
        {menu.map((item) => (
          <ListItem
            button
            key={item.name}
            component={Link}
            to={item.path}
          >
            <ListItemText primary={item.name} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
