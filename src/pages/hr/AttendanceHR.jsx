import React, { useEffect, useMemo, useState } from "react";
import {
  Box, Button, Paper, Table, TableBody, TableCell,
  TableHead, TableRow, Typography, TextField
} from "@mui/material";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import {
  initAttendanceDB,
  getAttendance,
  deleteAttendance
} from "../../services/attendanceService";

import MarkAttendanceDialog from "./MarkAttendanceDialog";
import DeleteConfirmDialog from "../../components/DeleteConfirmDialog";

const AttendanceHR = () => {
  const [records, setRecords] = useState([]);
  const [openMark, setOpenMark] = useState(false);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [openDelete, setOpenDelete] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [toEdit, setToEdit] = useState(null);


  const loadRecords = () => {
    initAttendanceDB();
    setRecords(getAttendance());
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      if (startDate && r.date < startDate) return false;
      if (endDate && r.date > endDate) return false;
      return true;
    });
  }, [records, startDate, endDate]);

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredRecords);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");

    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const file = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(file, "attendance.xlsx");
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Attendance Management
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
        <Button variant="contained" size="small" onClick={() => setOpenMark(true)}>
          Mark Attendance
        </Button>

        <TextField
          type="date"
          label="Start Date"
          size="small"
          InputLabelProps={{ shrink: true }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          sx={{ width: 180 }}
        />

        <TextField
          type="date"
          label="End Date"
          size="small"
          InputLabelProps={{ shrink: true }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          sx={{ width: 180 }}
        />

        <Button variant="outlined" size="small" onClick={loadRecords}>
          Refresh
        </Button>

        <Button variant="outlined" size="small" onClick={exportExcel}>
          Export Excel
        </Button>
      </Box>

      <Paper>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>Employee</TableCell>
        <TableCell>Email</TableCell>
        <TableCell>Department</TableCell>
        <TableCell>Date</TableCell>

        {/* NEW COLUMNS */}
        <TableCell>Clock In</TableCell>
        <TableCell>Clock Out</TableCell>
        <TableCell>Total Hours</TableCell>

        <TableCell>Status</TableCell>
        <TableCell>Note</TableCell>
        <TableCell align="right">Action</TableCell>
      </TableRow>
    </TableHead>

    <TableBody>
      {filteredRecords.map((r, i) => (
        <TableRow key={`${r.email}-${r.date}-${i}`}>
          <TableCell>{r.fullname || "-"}</TableCell>
          <TableCell>{r.email}</TableCell>
          <TableCell>{r.department || "-"}</TableCell>
          <TableCell>{r.date}</TableCell>

          {/* NEW FIELDS */}
          <TableCell>{r.clockIn || "-"}</TableCell>
          <TableCell>{r.clockOut || "-"}</TableCell>
          <TableCell>
            {r.totalHours !== undefined &&
            r.totalMinutes !== undefined &&
            r.totalSeconds !== undefined
              ? `${r.totalHours}h ${r.totalMinutes}m ${r.totalSeconds}s`
              : "-"}
          </TableCell>

          <TableCell>{r.status}</TableCell>
          <TableCell>{r.note || "-"}</TableCell>

          <TableCell align="right" sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
  
  {/* EDIT BUTTON */}
  <Button
    size="small"
    variant="outlined"
    color="primary"
    onClick={() => {
      setToEdit(r);
      setOpenMark(true);
    }}
  >
    Edit
  </Button>

  {/* DELETE BUTTON */}
  <Button
    size="small"
    color="error"
    variant="outlined"
    onClick={() => {
      setToDelete(r);
      setOpenDelete(true);
    }}
  >
    Delete
  </Button>
</TableCell>

        </TableRow>
      ))}

      {filteredRecords.length === 0 && (
        <TableRow>
          <TableCell colSpan={10} align="center">
            No attendance records found.
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  </Table>
</Paper>

     <MarkAttendanceDialog
  open={openMark}
  record={toEdit}         
  onClose={() => {
    setOpenMark(false);
    setToEdit(null);
  }}
  onSuccess={loadRecords}
/>


      <DeleteConfirmDialog
        open={openDelete}
        title="Delete Attendance"
        message={`Delete attendance for ${toDelete?.fullname} on ${toDelete?.date}?`}
        onClose={() => setOpenDelete(false)}
        onConfirm={() => {
          deleteAttendance(toDelete.email, toDelete.date);
          setOpenDelete(false);
          loadRecords();
        }}
      />
    </Box>
  );
};

export default AttendanceHR;
