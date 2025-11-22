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

import { addEmployee, getEmployees } from "../../services/employeeService";

const AddEmployeeDialog = ({ open, onClose, onSuccess }) => {
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

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Reset fields when dialog opens
  useEffect(() => {
    if (open) {
      setFullname("");
      setEmail("");
      setPhone("");
      setDob("");
      setJoinDate("");
      setDepartment("");
      setJobTitle("");
      setSalary("");
      setManager("");
      setPhoto(null);
      setError("");
      setSuccess("");
    }
  }, [open]);

  // Generate Employee ID safely
  const generateEmployeeID = () => {
    const employees = getEmployees();

    if (!employees.length) return "EMP001";

    const last = employees[employees.length - 1];

    // If missing or incorrect ID → regenerate
    if (!last.id || typeof last.id !== "string" || !last.id.startsWith("EMP")) {
      return `EMP${(employees.length + 1).toString().padStart(3, "0")}`;
    }

    const lastNum = parseInt(last.id.replace("EMP", ""), 10);
    const nextNum = isNaN(lastNum) ? employees.length + 1 : lastNum + 1;

    return `EMP${nextNum.toString().padStart(3, "0")}`;
  };

  // Basic Email Validation
  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleAdd = () => {
    if (
      !fullname ||
      !email ||
      !phone ||
      !dob ||
      !joinDate ||
      !department ||
      !jobTitle ||
      !salary ||
      !manager
    ) {
      setError("All fields are required.");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Invalid email format");
      return;
    }

    if (new Date(joinDate) <= new Date(dob)) {
      setError("Join Date must be after Date of Birth.");
      return;
    }

    const employee = {
      id: generateEmployeeID(),
      fullname,
      email,
      phone,
      dob,
      joinDate,
      department,
      jobTitle,
      salary,
      manager,
      photo,
    };

    const response = addEmployee(employee);

    if (!response.success) {
      setError(response.message);
      return;
    }

    setSuccess("Employee added successfully!");
    onSuccess();
    onClose();
  };

  // Convert image to Base64
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setPhoto(reader.result);

    reader.readAsDataURL(file);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Add New Employee</DialogTitle>

      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        {/* Profile Photo */}
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Avatar src={photo} sx={{ width: 80, height: 80, margin: "auto" }} />

          <Button variant="outlined" component="label" sx={{ mt: 1 }}>
            Upload Photo
            <input type="file" hidden accept="image/*" onChange={handlePhotoUpload} />
          </Button>
        </Box>

        {/* Form Fields */}
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
          label="Email"
          margin="dense"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={email !== "" && !isValidEmail(email)}
          helperText={email !== "" && !isValidEmail(email) ? "Invalid email" : ""}
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
          onChange={(e) => setSalary(Number(e.target.value))}
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

        <Button variant="contained" onClick={handleAdd}>
          Add Employee
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEmployeeDialog;
