import React, { useEffect, useState } from "react";
import { Box, Paper, Typography, Avatar, Grid, Button } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { getEmployees } from "../../services/employeeService";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const EmployeeProfile = () => {
  const { user } = useAuth(); 
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    if (!user || !user.email) return;

    const employees = getEmployees();
    const found = employees.find((e) => e.email.toLowerCase() === user.email.toLowerCase());

    setEmployee(found || null);
  }, [user]);

  if (!user) {
    return (
      <Typography variant="h6" color="error">
        No logged in user found.
      </Typography>
    );
  }

  if (!employee) {
    return (
      <Typography variant="h6" color="error">
        No employee profile found for: <strong>{user.email}</strong>
      </Typography>
    );
  }

  // PDF GENERATE FUNCTION
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Employee Profile", 14, 15);

    autoTable(doc, {
      startY: 25,
      head: [["Field", "Details"]],
      body: [
        ["Name", employee.fullname],
        ["Email", employee.email],
        ["Phone", employee.phone],
        ["Department", employee.department],
        ["Designation", employee.jobTitle],
        ["Manager", employee.manager],
        ["Salary", employee.salary],
        ["Join Date", employee.joinDate],
        ["Date of Birth", employee.dob],
        ["Employee ID", employee.id],
      ],
    });

    doc.save(`${employee.fullname}-profile.pdf`);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>

      <Paper sx={{ p: 3 }}>
        {/* TOP SECTION */}
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Avatar
            src={employee.photo}
            sx={{ width: 120, height: 120, margin: "auto" }}
          />
          <Typography variant="h5" sx={{ mt: 1 }}>
            {employee.fullname}
          </Typography>
          <Typography color="gray">{employee.jobTitle}</Typography>
          <Typography color="gray">Employee ID: {employee.id}</Typography>
        </Box>

        {/* DETAILS GRID */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography fontWeight="bold">Email</Typography>
            <Typography>{employee.email}</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography fontWeight="bold">Phone</Typography>
            <Typography>{employee.phone}</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography fontWeight="bold">Department</Typography>
            <Typography>{employee.department}</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography fontWeight="bold">Job Title</Typography>
            <Typography>{employee.jobTitle}</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography fontWeight="bold">Manager</Typography>
            <Typography>{employee.manager}</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography fontWeight="bold">Salary</Typography>
            <Typography>${employee.salary}</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography fontWeight="bold">Join Date</Typography>
            <Typography>{employee.joinDate}</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography fontWeight="bold">Date of Birth</Typography>
            <Typography>{employee.dob}</Typography>
          </Grid>
        </Grid>

        {/* PDF BUTTON */}
        <Box sx={{ mt: 3, textAlign: "right" }}>
          <Button variant="contained" onClick={downloadPDF}>
            Download PDF
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default EmployeeProfile;
