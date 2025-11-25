import React from "react";
import { Box } from "@mui/material";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const EmployeeLayout = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar role="employee" />

      <Box sx={{ flexGrow: 1 }}>
        <Navbar />

        {/* VERY IMPORTANT → nested routes will appear here */}
        <Box sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default EmployeeLayout;
