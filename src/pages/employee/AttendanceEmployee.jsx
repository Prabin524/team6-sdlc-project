import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box, Paper, Table, TableBody, TableCell,
  TableHead, TableRow, Typography, TextField
} from "@mui/material";

import {
  initAttendanceDB,
  getAttendanceByEmail
} from "../../services/attendanceService";

import { useAuth } from "../../context/AuthContext";

const AttendanceEmployee = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Reload attendance
  const reloadRecords = useCallback(() => {
    if (user?.email) {
      setRecords(getAttendanceByEmail(user.email));
    }
  }, [user?.email]);

  useEffect(() => {
    initAttendanceDB();
    reloadRecords();
  }, [user, reloadRecords]);

  // Filter by date range
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      if (startDate && r.date < startDate) return false;
      if (endDate && r.date > endDate) return false;
      return true;
    });
  }, [records, startDate, endDate]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Attendance
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          type="date"
          label="Start Date"
          InputLabelProps={{ shrink: true }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <TextField
          type="date"
          label="End Date"
          InputLabelProps={{ shrink: true }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </Box>

      {/* ATTENDANCE TABLE */}
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Clock In</TableCell>
              <TableCell>Clock Out</TableCell>
              <TableCell>Total Hours</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredRecords.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.clockIn || "-"}</TableCell>
                <TableCell>{row.clockOut || "-"}</TableCell>

                <TableCell>
                  {row.totalHours !== undefined &&
                   row.totalMinutes !== undefined &&
                   row.totalSeconds !== undefined ? (
                    `${row.totalHours}h ${row.totalMinutes}m ${row.totalSeconds}s`
                  ) : (
                    "-"
                  )}
                </TableCell>

                <TableCell>{row.status}</TableCell>
              </TableRow>
            ))}

            {filteredRecords.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default AttendanceEmployee;
