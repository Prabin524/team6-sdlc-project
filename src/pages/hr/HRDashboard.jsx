import React, { useCallback, useEffect, useState } from "react";
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
  Chip,
} from "@mui/material";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

import { useNavigate } from "react-router-dom";

import { getEmployees } from "../../services/employeeService";
import { getAttendance } from "../../services/attendanceService";

const COLORS = ["#4caf50", "#2196f3", "#ff9800", "#e91e63", "#9c27b0"];

const HRDashboard = () => {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [attendanceToday, setAttendanceToday] = useState({
    present: 0,
    completed: 0,
    absent: 0,
    leave: 0,
  });
  const [deptCount, setDeptCount] = useState([]);
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [weeklyTrend, setWeeklyTrend] = useState([]);

  const loadDashboard = useCallback(() => {
    const empList = getEmployees() || [];
    setEmployees(empList);

    const today = new Date().toISOString().slice(0, 10);
    const allAttendance = getAttendance() || [];

    // ---- Today's attendance summary ----
    const presentManual = allAttendance.filter(
      (a) => a.date === today && a.status === "Present"
    ).length;

    const completedCount = allAttendance.filter(
      (a) => a.date === today && a.status === "Completed"
    ).length;

    const absentCount = allAttendance.filter(
      (a) => a.date === today && a.status === "Absent"
    ).length;

    const leaveCount = allAttendance.filter(
      (a) => a.date === today && a.status === "Leave"
    ).length;

    setAttendanceToday({
      present: presentManual + completedCount, // treat Completed as present + finished
      completed: completedCount,
      absent: absentCount,
      leave: leaveCount,
    });

    // ---- Department-wise employee distribution ----
    const deptMap = {};
    empList.forEach((e) => {
      if (!e.department) return;
      deptMap[e.department] = (deptMap[e.department] || 0) + 1;
    });

    const deptArray = Object.keys(deptMap).map((key) => ({
      name: key,
      value: deptMap[key],
    }));

    setDeptCount(deptArray);

    // ---- Weekly attendance trend (last 7 days) ----
    const weeklyData = buildWeeklyTrend(allAttendance);
    setWeeklyTrend(weeklyData);

    // ---- Recent attendance (last 5 records) ----
    const latest = allAttendance.slice(-5).reverse();
    setRecentAttendance(latest);
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  // Build last 7 days trend
  const buildWeeklyTrend = (allAttendance) => {
    const result = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);

      const dayLabel = d.toLocaleDateString("en-US", {
        weekday: "short",
      }); // Mon, Tue...

      const forDay = allAttendance.filter((a) => a.date === dateStr);

      const presentCount = forDay.filter(
        (a) => a.status === "Present" || a.status === "Completed"
      ).length;
      const absentCount = forDay.filter((a) => a.status === "Absent").length;
      const leaveCount = forDay.filter((a) => a.status === "Leave").length;

      result.push({
        day: dayLabel,
        present: presentCount,
        absent: absentCount,
        leave: leaveCount,
      });
    }

    return result;
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight={600}>
        HR Analytics Dashboard
      </Typography>

      {/* ===== TOP ANALYTICS CARDS ===== */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Total Employees */}
        <Grid item xs={12} md={3}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              background: "linear-gradient(135deg, #42a5f5, #1e88e5)",
              color: "white",
              boxShadow: 4,
            }}
          >
            <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
              TOTAL EMPLOYEES
            </Typography>
            <Typography variant="h3" fontWeight={700}>
              {employees.length}
            </Typography>
          </Paper>
        </Grid>

        {/* Present Today */}
        <Grid item xs={12} md={3}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              background: "linear-gradient(135deg, #66bb6a, #43a047)",
              color: "white",
              boxShadow: 4,
            }}
          >
            <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
              PRESENT TODAY
            </Typography>
            <Typography variant="h3" fontWeight={700}>
              {attendanceToday.present}
            </Typography>
          </Paper>
        </Grid>

        {/* Completed Today */}
        <Grid item xs={12} md={3}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              background: "linear-gradient(135deg, #fb8c00, #ef6c00)",
              color: "white",
              boxShadow: 4,
            }}
          >
            <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
              COMPLETED TODAY
            </Typography>
            <Typography variant="h3" fontWeight={700}>
              {attendanceToday.completed}
            </Typography>
          </Paper>
        </Grid>

        {/* Absent Today */}
        <Grid item xs={12} md={3}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              background: "linear-gradient(135deg, #e53935, #d32f2f)",
              color: "white",
              boxShadow: 4,
            }}
          >
            <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
              ABSENT TODAY
            </Typography>
            <Typography variant="h3" fontWeight={700}>
              {attendanceToday.absent}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* ===== CHARTS ROW ===== */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Department Pie Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3, height: "100%" }}>
            <Typography variant="h6" mb={2} fontWeight={600}>
              Department-wise Employee Distribution
            </Typography>

            {deptCount.length > 0 ? (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <PieChart width={400} height={320}>
                  <Pie
                    data={deptCount}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={110}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {deptCount.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No department data available.
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Weekly Trend Line Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3, height: "100%" }}>
            <Typography variant="h6" mb={2} fontWeight={600}>
              Weekly Attendance Trend (Last 7 Days)
            </Typography>

            {weeklyTrend.length > 0 ? (
              <LineChart width={500} height={280} data={weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="present"
                  stroke="#43a047"
                  strokeWidth={3}
                  name="Present"
                />
                <Line
                  type="monotone"
                  dataKey="absent"
                  stroke="#e53935"
                  strokeWidth={3}
                  name="Absent"
                />
                <Line
                  type="monotone"
                  dataKey="leave"
                  stroke="#fb8c00"
                  strokeWidth={3}
                  name="Leave"
                />
              </LineChart>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Not enough attendance data to show trend.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* ===== RECENT ATTENDANCE TABLE ===== */}
      <Paper sx={{ p: 4, mb: 4, borderRadius: 3, boxShadow: 3 }}>
        <Typography variant="h6" gutterBottom fontWeight={600}>
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
                <TableCell>{item.fullname || "-"}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell>
                  <Chip
                    label={item.status}
                    color={
                      item.status === "Present" || item.status === "Completed"
                        ? "success"
                        : item.status === "Absent"
                        ? "error"
                        : item.status === "Leave"
                        ? "warning"
                        : "default"
                    }
                    size="small"
                  />
                </TableCell>
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
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Button
          variant="contained"
          sx={{ py: 1.2, px: 3, borderRadius: 2 }}
          onClick={() => navigate("/hr/employees")}
        >
          Manage Employees
        </Button>

        <Button
          variant="contained"
          color="success"
          sx={{ py: 1.2, px: 3, borderRadius: 2 }}
          onClick={() => navigate("/hr/attendance")}
        >
          Mark Attendance
        </Button>

        <Button
          variant="outlined"
          sx={{ py: 1.2, px: 3, borderRadius: 2 }}
          onClick={() => navigate("/hr/attendance")}
        >
          View Attendance
        </Button>
      </Box>
    </Box>
  );
};

export default HRDashboard;
