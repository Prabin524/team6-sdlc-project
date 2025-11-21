import React from "react";
import { Box } from "@mui/material";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const EmployeeLayout = ({ children }) => {
  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar role="employee" />
      <Box sx={{ flexGrow: 1 }}>
        <Navbar />
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default EmployeeLayout;
