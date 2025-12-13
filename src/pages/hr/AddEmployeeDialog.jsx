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
import { getUsers, saveUsers } from "../../services/userService";

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
  const [loginInfo, setLoginInfo] = useState(null);

  // Reset form when opened
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
      setLoginInfo(null);
    }
  }, [open]);

  // Generate Employee ID
  const generateEmployeeID = () => {
    const employees = getEmployees();
    if (!employees.length) return "EMP001";

    const last = employees[employees.length - 1];
    const lastNum = parseInt(last.id?.replace("EMP", "") || 0, 10) + 1;

    return `EMP${String(lastNum).padStart(3, "0")}`;
  };

  const isValidEmail = (emailStr) => /\S+@\S+\.\S+/.test(emailStr);

  const generatePassword = () =>
    Math.random().toString(36).slice(-8); // random 8 char password

  const handleAdd = () => {
    setError("");
    setLoginInfo(null);

    // Basic validation
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
      setError("Invalid email format.");
      return;
    }

    if (new Date(joinDate) <= new Date(dob)) {
      setError("Join Date must be after Date of Birth.");
      return;
    }

    const id = generateEmployeeID();

    // ------------------------------
    // 1️⃣ VALIDATE LOGIN EMAIL FIRST
    // ------------------------------
    const users = getUsers();
    if (users.some((u) => u.email === email)) {
      setError("An user account already exists with this email.");
      return;
    }

    // ------------------------------
    // 2️⃣ CREATE EMPLOYEE RECORD
    // ------------------------------
    const employee = {
      id,
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

    const result = addEmployee(employee);
    if (!result.success) {
      setError(result.message);
      return;
    }

//EMPLOYEE LOGIN CREATED
    const tempPassword = generatePassword();

    const newUser = {
      fullname,
      email,
      password: tempPassword,
      role: "employee",
      status: "active",
    };

    users.push(newUser);
    saveUsers(users);

    setLoginInfo({
      id,
      email,
      password: tempPassword,
    });

    onSuccess(); 
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setPhoto(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Add New Employee</DialogTitle>

      <DialogContent>
        {/* Error Notice */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* SUCCESS POPUP */}
        {loginInfo && (
          <Alert severity="success" sx={{ mb: 2 }}>
            <strong>Employee Created Successfully!</strong>
            <br />
            <strong>Employee ID:</strong> {loginInfo.id}
            <br />
            <strong>Email:</strong> {loginInfo.email}
            <br />
            <strong>Temporary Password:</strong> {loginInfo.password}
            <br />
            Provide these login credentials to the employee.
          </Alert>
        )}

        {/* PHOTO */}
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Avatar src={photo} sx={{ width: 80, height: 80, margin: "auto" }} />
          <Button variant="outlined" component="label" sx={{ mt: 1 }}>
            Upload Photo
            <input hidden type="file" accept="image/*" onChange={handlePhotoUpload} />
          </Button>
        </Box>

        {/* FORM FIELDS */}
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
        <Button onClick={onClose}>Close</Button>

        {/* Only disabled when already created */}
        <Button
          variant="contained"
          onClick={handleAdd}
          disabled={!!loginInfo}
        >
          Add Employee
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEmployeeDialog;
