import React, { useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Alert
} from "@mui/material";

import { getEmployees } from "../../services/employeeService";
import { markAttendance } from "../../services/attendanceService";

const MarkAttendanceDialog = ({ open, onClose, onSuccess, record }) => {
  const [employees, setEmployees] = useState([]);

  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("Present");
  const [note, setNote] = useState("");
  const [clockIn, setClockIn] = useState("");
  const [clockOut, setClockOut] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setEmployees(getEmployees());

      if (record) {
        // EDIT mode
        setEmail(record.email);
        setDate(record.date);
        setStatus(record.status || "Present");
        setNote(record.note || "");
        setClockIn(record.clockIn || "");
        setClockOut(record.clockOut || "");
      } else {
        // ADD mode
        setEmail("");
        setDate("");
        setStatus("Present");
        setNote("");
        setClockIn("");
        setClockOut("");
      }

      setError("");
    }
  }, [open, record]);

  const handleSave = () => {
    if (!email || !date) {
      setError("Employee and Date are required.");
      return;
    }

    const emp = employees.find((e) => e.email === email);

    const updatedRecord = {
      email,
      fullname: emp?.fullname || "",
      department: emp?.department || "",
      date,
      status,
      note,
      clockIn: clockIn || null,
      clockOut: clockOut || null,
      markedAt: new Date().toISOString(),
    };

    markAttendance(updatedRecord);
    onSuccess();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>
        {record ? "Edit Attendance" : "Mark Attendance"}
      </DialogTitle>

      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <TextField
          fullWidth
          select
          label="Employee"
          margin="dense"
          value={email}
          disabled={!!record}  // Cannot change employee in edit
          onChange={(e) => setEmail(e.target.value)}
        >
          {employees.map((emp) => (
            <MenuItem key={emp.id} value={emp.email}>
              {emp.fullname} ({emp.email})
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          type="date"
          label="Date"
          margin="dense"
          InputLabelProps={{ shrink: true }}
          value={date}
          disabled={!!record} // cannot change date in edit
          onChange={(e) => setDate(e.target.value)}
        />

        <TextField
          fullWidth
          select
          label="Status"
          margin="dense"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <MenuItem value="Present">Present</MenuItem>
          <MenuItem value="Absent">Absent</MenuItem>
          <MenuItem value="Leave">Leave</MenuItem>
        </TextField>

        <TextField
          fullWidth
          label="Clock In (HH:MM:SS or leave blank)"
          margin="dense"
          value={clockIn}
          onChange={(e) => setClockIn(e.target.value)}
        />

        <TextField
          fullWidth
          label="Clock Out (HH:MM:SS or leave blank)"
          margin="dense"
          value={clockOut}
          onChange={(e) => setClockOut(e.target.value)}
        />

        <TextField
          fullWidth
          label="Note (optional)"
          margin="dense"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MarkAttendanceDialog;
