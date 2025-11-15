import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Alert,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from "@mui/material";
import { getSystemStats } from "../../services/adminStatsService";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [filterStart, setFilterStart] = useState("");
  const [filterEnd, setFilterEnd] = useState("");

  const loadStats = () => {
    const result = getSystemStats();
    if (!result.success) {
      setError(result.error);
    } else {
      setStats(result.data);
      setError("");
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  // Filter logs by date range
  const filterLogs = (logs) => {
    if (!filterStart && !filterEnd) return logs;

    return logs.filter((log) => {
      const date = new Date(log.date);
      const start = filterStart ? new Date(filterStart) : null;
      const end = filterEnd ? new Date(filterEnd) : null;

      if (start && end) return date >= start && date <= end;
      if (start) return date >= start;
      if (end) return date <= end;

      return true;
    });
  };

  // Export to PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("System Activity Report", 14, 15);

    autoTable(doc, {
      head: [["Email", "Date", "Time"]],
      body: stats.recentLogins.map((log) => [log.email, log.date, log.time])
    });

    doc.save("system-report.pdf");
  };

  // Export to Excel
  const exportExcel = () => {
    const data =
      "data:text/csv;charset=utf-8," +
      ["Email,Date,Time"]
        .concat(stats.recentLogins.map((l) => `${l.email},${l.date},${l.time}`))
        .join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(data);
    link.download = "system-report.csv";
    link.click();
  };

  if (error) {
    return (
      <Box>
        <Alert severity="error">{error}</Alert>
        <Button sx={{ mt: 2 }} variant="contained" onClick={loadStats}>
          Retry
        </Button>
      </Box>
    );
  }

  if (!stats) return <Typography>Loading...</Typography>;

  const filteredLogs = filterLogs(stats.recentLogins);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      {/* STATS */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Total Users</Typography>
            <Typography variant="h3">{stats.totalUsers}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Active Today</Typography>
            <Typography variant="h3">{stats.activeToday}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Recent Logins</Typography>
            <Typography variant="h3">{stats.recentLogins.length}</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* FILTER SECTION */}
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Filter Login Records
        </Typography>

        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            type="date"
            label="Start Date"
            value={filterStart}
            onChange={(e) => setFilterStart(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            type="date"
            label="End Date"
            value={filterEnd}
            onChange={(e) => setFilterEnd(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />

          <Button variant="contained" onClick={loadStats}>
            Refresh
          </Button>
        </Box>

        {/* EXPORT BUTTONS */}
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <Button variant="outlined" onClick={exportPDF}>
            Export PDF
          </Button>
          <Button variant="outlined" onClick={exportExcel}>
            Export Excel
          </Button>
        </Box>

        {/* TABLE OF LOGINS */}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log, index) => (
                <TableRow key={index}>
                  <TableCell>{log.email}</TableCell>
                  <TableCell>{log.date}</TableCell>
                  <TableCell>{log.time}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell>No Records Found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default AdminDashboard;
