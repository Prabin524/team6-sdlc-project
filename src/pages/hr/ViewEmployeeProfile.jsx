import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Avatar,
  Grid,
  Button,
  Paper,
} from "@mui/material";

const ViewEmployeeProfile = ({ open, onClose, employee }) => {
  if (!employee) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Employee Profile</DialogTitle>

      <DialogContent>
        <Box
          sx={{
            display: "flex",
            gap: 3,
            alignItems: "center",
            mb: 3,
            p: 2,
            borderRadius: 2,
            backgroundColor: "#f5f5f5",
          }}
        >
          <Avatar src={employee.photo} sx={{ width: 100, height: 100 }} />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              {employee.fullname}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: "gray" }}>
              {employee.jobTitle}
            </Typography>
            <Typography variant="body2" sx={{ color: "gray" }}>
              Employee ID: {employee.id}
            </Typography>
          </Box>
        </Box>

        <Paper sx={{ p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2">Email</Typography>
              <Typography variant="body1">{employee.email}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2">Phone</Typography>
              <Typography variant="body1">{employee.phone}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2">Date of Birth</Typography>
              <Typography variant="body1">{employee.dob}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2">Join Date</Typography>
              <Typography variant="body1">{employee.joinDate}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2">Department</Typography>
              <Typography variant="body1">{employee.department}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2">Job Title</Typography>
              <Typography variant="body1">{employee.jobTitle}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2">Salary</Typography>
              <Typography variant="body1">${employee.salary}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2">Manager</Typography>
              <Typography variant="body1">{employee.manager}</Typography>
            </Grid>
          </Grid>
        </Paper>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewEmployeeProfile;
