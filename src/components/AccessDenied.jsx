import React from "react";
import { Typography, Box } from "@mui/material";

const AccessDenied = () => {
  return (
    <Box sx={{ textAlign: "center", mt: 10 }}>
      <Typography variant="h3" color="error">
        Access Denied
      </Typography>
      <Typography variant="h6" mt={2}>
        You do not have permission to view this page.
      </Typography>
    </Box>
  );
};

export default AccessDenied;
