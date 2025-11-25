import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Grid,
  Button
} from "@mui/material";

import { useAuth } from "../../context/AuthContext";
import { getEmployees } from "../../services/employeeService";
import jsPDF from "jspdf";

const EmployeeProfile = () => {
  const { user } = useAuth();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    if (user) {
      const employees = getEmployees();
      const emp = employees.find((e) => e.email === user.email);
      setEmployee(emp);
    }
  }, [user]);

  if (!employee) {
    return (
      <Typography variant="h6" sx={{ mt: 3 }}>
        No employee profile found.
      </Typography>
    );
  }

  // ---------------------- PDF EXPORT ----------------------
  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Employee Profile", 14, 20);

    doc.setFontSize(12);

    doc.text(`Full Name: ${employee.fullname}`, 14, 40);
    doc.text(`Email: ${employee.email}`, 14, 50);
    doc.text(`Phone: ${employee.phone}`, 14, 60);
    doc.text(`Department: ${employee.department}`, 14, 70);
    doc.text(`Job Title: ${employee.jobTitle}`, 14, 80);
    doc.text(`Designation: ${employee.jobTitle}`, 14, 90);
    doc.text(`Manager: ${employee.manager || "N/A"}`, 14, 100);
    doc.text(`Join Date: ${employee.joinDate}`, 14, 110);
    doc.text(`Salary: $${employee.salary}`, 14, 120);

    doc.save(`${employee.fullname}-profile.pdf`);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Photo */}
          <Grid item xs={12} md={3} sx={{ textAlign: "center" }}>
            <Avatar
              src={employee.photo || ""}
              sx={{ width: 120, height: 120, margin: "auto" }}
            />
          </Grid>

          {/* Information */}
          <Grid item xs={12} md={9}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography><strong>Full Name:</strong> {employee.fullname}</Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography><strong>Email:</strong> {employee.email}</Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography><strong>Phone:</strong> {employee.phone}</Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography><strong>Department:</strong> {employee.department}</Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography><strong>Job Title:</strong> {employee.jobTitle}</Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography><strong>Designation:</strong> {employee.jobTitle}</Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography><strong>Manager:</strong> {employee.manager || "N/A"}</Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography><strong>Join Date:</strong> {employee.joinDate}</Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography><strong>Salary:</strong> ${employee.salary}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

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
