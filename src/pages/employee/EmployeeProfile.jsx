import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Box, Paper, Typography, Avatar, Grid } from "@mui/material";

const EmployeeProfile = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: "flex", gap: 3, mb: 3 }}>
          <Avatar src={user.photo} sx={{ width: 100, height: 100 }} />
          <Box>
            <Typography variant="h5">{user.fullname}</Typography>
            <Typography color="gray">{user.jobTitle || "Employee"}</Typography>
          </Box>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography>Email</Typography>
            <Typography>{user.email}</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography>Department</Typography>
            <Typography>{user.department || "N/A"}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default EmployeeProfile;
