// src/components/users/AddUserDialog.jsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Alert,
} from "@mui/material";

import { addUser } from "../../services/userService";

const AddUserDialog = ({ open, onClose, onSuccess }) => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setFullname("");
      setEmail("");
      setRole("admin");
      setPassword("");
      setError("");
    }
  }, [open]);

  const isValidEmail = (value) => /\S+@\S+\.\S+/.test(value);

  const handleAdd = () => {
    if (!fullname || !email || !password || !role) {
      setError("All fields are required");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Invalid email format");
      return;
    }

    // 🔥 Only admin & hr allowed from this dialog
    if (role === "employee") {
      setError("Employee accounts must be created by HR, not Admin.");
      return;
    }

    const response = addUser({
      fullname,
      email,
      password,
      role,
      status: "Active",
    });

    if (!response.success) {
      setError(response.message);
      return;
    }

    onSuccess();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Add Admin / HR User</DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Full Name"
          margin="dense"
          required
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
        />

        <TextField
          fullWidth
          label="Email"
          margin="dense"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={email !== "" && !isValidEmail(email)}
          helperText={
            email !== "" && !isValidEmail(email) ? "Invalid email format" : ""
          }
        />

        <TextField
          fullWidth
          type="password"
          label="Password"
          required
          margin="dense"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <TextField
          fullWidth
          required
          select
          label="Role"
          margin="dense"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="hr">HR</MenuItem>
        </TextField>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleAdd}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddUserDialog;
