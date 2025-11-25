import React, { useEffect, useMemo, useState } from "react";
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

  useEffect(() => {
    initAttendanceDB();
    if (user?.email) {
      setRecords(getAttendanceByEmail(user.email));
    }
  }, [user]);

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

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Note</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredRecords.map((r, i) => (
              <TableRow key={`${r.date}-${i}`}>
                <TableCell>{r.date}</TableCell>
                <TableCell>{r.status}</TableCell>
                <TableCell>{r.note || "-"}</TableCell>
              </TableRow>
            ))}

            {filteredRecords.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No attendance records yet.
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
