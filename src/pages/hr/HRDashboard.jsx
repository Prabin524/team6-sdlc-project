import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

import { getEmployees } from "../../services/employeeService";
import { getAttendance } from "../../services/attendanceService";

import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#4caf50", "#2196f3", "#ff9800", "#e91e63", "#9c27b0"];

const HRDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [attendanceToday, setAttendanceToday] = useState({
    present: 0,
    absent: 0,
    leave: 0,
  });
  const [deptCount, setDeptCount] = useState([]);
  const [recentAttendance, setRecentAttendance] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = () => {
    const empList = getEmployees();
    setEmployees(empList);

    const today = new Date().toISOString().slice(0, 10);
    const allAttendance = getAttendance();

    // Today's attendance summary
    const presentCount = allAttendance.filter(
      (a) => a.date === today && a.status === "Present"
    ).length;

    const absentCount = allAttendance.filter(
      (a) => a.date === today && a.status === "Absent"
    ).length;

    const leaveCount = allAttendance.filter(
      (a) => a.date === today && a.status === "Leave"
    ).length;

    setAttendanceToday({
      present: presentCount,
      absent: absentCount,
      leave: leaveCount,
    });

    // Department count
    const deptMap = {};
    empList.forEach((e) => {
      deptMap[e.department] = (deptMap[e.department] || 0) + 1;
    });

    const deptArray = Object.keys(deptMap).map((key) => ({
      name: key,
      value: deptMap[key],
    }));

    setDeptCount(deptArray);

    // Recent Attendance
    const latest = allAttendance.slice(-5).reverse();
    setRecentAttendance(latest);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        HR Dashboard
      </Typography>

      {/* ===== TOP STATS SECTION ===== */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6">Total Employees</Typography>
            <Typography variant="h4" sx={{ mt: 1 }}>
              {employees.length}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6">Present Today</Typography>
            <Typography variant="h4" sx={{ mt: 1 }}>
              {attendanceToday.present}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6">Absent Today</Typography>
            <Typography variant="h4" sx={{ mt: 1 }}>
              {attendanceToday.absent}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* ===== DEPARTMENT CHART ===== */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Department-wise Employee Distribution
        </Typography>

        <PieChart width={350} height={300}>
          <Pie
            data={deptCount}
            cx={150}
            cy={150}
            innerRadius={50}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
          >
            {deptCount.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </Paper>

      {/* ===== RECENT ATTENDANCE ===== */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Recent Attendance
        </Typography>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {recentAttendance.map((item, i) => (
              <TableRow key={i}>
                <TableCell>{item.fullname}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.status}</TableCell>
              </TableRow>
            ))}

            {recentAttendance.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No attendance records yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* ===== QUICK ACTION BUTTONS ===== */}
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button variant="contained" onClick={() => (window.location.href = "/hr/employees")}>
          Manage Employees
        </Button>

        <Button variant="contained" color="success" onClick={() => (window.location.href = "/hr/attendance")}>
          Mark Attendance
        </Button>

        <Button variant="outlined" onClick={() => (window.location.href = "/hr/attendance")}>
          View Attendance
        </Button>
      </Box>
    </Box>
  );
};

export default HRDashboard;
