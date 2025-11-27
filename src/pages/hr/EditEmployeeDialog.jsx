import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
  Alert,
  Avatar,
  Box,
} from "@mui/material";

import { updateEmployee } from "../../services/employeeService";
import { getUsers, updateUser } from "../../services/userService";

const EditEmployeeDialog = ({ open, onClose, employee, onSuccess }) => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [joinDate, setJoinDate] = useState("");
  const [department, setDepartment] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [salary, setSalary] = useState("");
  const [manager, setManager] = useState("");
  const [photo, setPhoto] = useState(null);

  // ⭐ New: password reset
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (employee) {
      setFullname(employee.fullname || "");
      setEmail(employee.email || "");
      setPhone(employee.phone || "");
      setDob(employee.dob || "");
      setJoinDate(employee.joinDate || "");
      setDepartment(employee.department || "");
      setJobTitle(employee.jobTitle || "");
      setSalary(employee.salary ?? "");
      setManager(employee.manager || "");
      setPhoto(employee.photo || null);
      setPassword(""); // blank by default (only reset if HR enters)
      setError("");
      setSuccess("");
    }
  }, [employee]);

  const isValidEmail = (emailStr) => /\S+@\S+\.\S+/.test(emailStr);

  const handleUpdate = () => {
    setError("");
    setSuccess("");

    if (
      !fullname.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !dob ||
      !joinDate ||
      !department ||
      !jobTitle.trim() ||
      salary === "" ||
      !manager.trim()
    ) {
      setError("All fields except password are required.");
      return;
    }

    if (!isValidEmail(email.trim())) {
      setError("Invalid email format.");
      return;
    }

    if (new Date(joinDate) <= new Date(dob)) {
      setError("Join date must be after Date of Birth.");
      return;
    }

    const updatedData = {
      fullname: fullname.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      dob,
      joinDate,
      department,
      jobTitle: jobTitle.trim(),
      salary: Number(salary),
      manager: manager.trim(),
      photo,
    };

    // ===================== UPDATE EMPLOYEE DB =====================
    const result = updateEmployee(employee.id, updatedData);
    if (!result.success) {
      setError(result.message || "Failed to update employee.");
      return;
    }

    // ===================== UPDATE USER LOGIN DB =====================
    const users = getUsers();
    const loginUser = users.find((u) => u.email === employee.email);

    if (loginUser) {
      const loginUpdates = {
        fullname,
        email: email.trim().toLowerCase(),
      };

      // HR entered a new password → update it
      if (password.trim() !== "") {
        loginUpdates.password = password.trim();
      }

      const loginResult = updateUser(employee.email, loginUpdates);

      if (!loginResult.success) {
        setError("Employee updated but login update failed: " + loginResult.message);
        return;
      }
    }

    setSuccess("Employee & Login updated successfully!");
    onSuccess?.();
    onClose?.();
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setPhoto(reader.result);
    reader.readAsDataURL(file);
  };

  if (!employee) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Edit Employee</DialogTitle>

      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Avatar src={photo} sx={{ width: 80, height: 80, margin: "auto" }} />
          <Button variant="outlined" component="label" sx={{ mt: 1 }}>
            Change Photo
            <input type="file" hidden accept="image/*" onChange={handlePhotoUpload} />
          </Button>
        </Box>

        <TextField fullWidth label="Employee ID" margin="dense" disabled value={employee.id} />

        <TextField
          fullWidth
          required
          label="Full Name"
          margin="dense"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
        />

        <TextField
          fullWidth
          required
          label="Email (Username)"
          margin="dense"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={email !== "" && !isValidEmail(email)}
          helperText={email !== "" && !isValidEmail(email) ? "Invalid email" : ""}
        />

        {/* ⭐ NEW PASSWORD RESET FIELD */}
        <TextField
          fullWidth
          label="Reset Password (optional)"
          margin="dense"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          helperText="Leave empty to keep current password"
        />

        <TextField
          fullWidth
          required
          label="Phone"
          margin="dense"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <TextField
          fullWidth
          required
          type="date"
          label="Date of Birth"
          margin="dense"
          InputLabelProps={{ shrink: true }}
          value={dob}
          onChange={(e) => setDob(e.target.value)}
        />

        <TextField
          fullWidth
          required
          type="date"
          label="Join Date"
          margin="dense"
          InputLabelProps={{ shrink: true }}
          value={joinDate}
          onChange={(e) => setJoinDate(e.target.value)}
        />

        <TextField
          fullWidth
          required
          select
          label="Department"
          margin="dense"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        >
          <MenuItem value="HR">HR</MenuItem>
          <MenuItem value="Finance">Finance</MenuItem>
          <MenuItem value="Engineering">Engineering</MenuItem>
          <MenuItem value="Marketing">Marketing</MenuItem>
          <MenuItem value="Operations">Operations</MenuItem>
        </TextField>

        <TextField
          fullWidth
          required
          label="Job Title"
          margin="dense"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
        />

        <TextField
          fullWidth
          required
          type="number"
          label="Salary"
          margin="dense"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
        />

        <TextField
          fullWidth
          required
          label="Manager"
          margin="dense"
          value={manager}
          onChange={(e) => setManager(e.target.value)}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleUpdate}>
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditEmployeeDialog;
