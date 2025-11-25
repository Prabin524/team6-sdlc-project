import React, { useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Alert
} from "@mui/material";

import { getEmployees } from "../../services/employeeService";
import { markAttendance } from "../../services/attendanceService";

const MarkAttendanceDialog = ({ open, onClose, onSuccess }) => {
  const [employees, setEmployees] = useState([]);

  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("Present");
  const [note, setNote] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setEmployees(getEmployees());
      setEmail("");
      setDate("");
      setStatus("Present");
      setNote("");
      setError("");
    }
  }, [open]);

  const handleSave = () => {
    if (!email || !date || !status) {
      setError("Employee, Date and Status are required.");
      return;
    }

    const emp = employees.find((e) => e.email === email);

    const record = {
      email,
      fullname: emp?.fullname || "",
      department: emp?.department || "",
      date,                 // yyyy-mm-dd
      status,               // Present / Absent / Leave
      note,
      markedAt: new Date().toISOString()
    };

    markAttendance(record);
    onSuccess();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Mark Attendance</DialogTitle>

      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <TextField
          fullWidth
          select
          label="Employee"
          margin="dense"
          value={email}
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
