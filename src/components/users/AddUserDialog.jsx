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
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Reset all fields when dialog opens
  useEffect(() => {
    if (open) {
      setFullname("");
      setEmail("");
      setRole("");
      setPassword("");
      setError("");
    }
  }, [open]);

  // Email validation regex
  const validateEmail = (email) => {
    return /^\S+@\S+\.\S+$/.test(email);
  };

  const handleAdd = () => {
    // Validations
    if (!fullname || !email || !password || !role) {
      setError("All fields are required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
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
    <Dialog
      open={open}
      onClose={() => {
        setError("");
        onClose();
      }}
      fullWidth
    >
      <DialogTitle>Add New User</DialogTitle>
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
          error={email !== "" && !validateEmail(email)}
          helperText={
            email !== "" && !validateEmail(email)
              ? "Invalid email format"
              : ""
          }
        />

        <TextField
          fullWidth
          type="password"
          label="Password"
          margin="dense"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={password !== "" && password.length < 6}
          helperText={
            password !== "" && password.length < 6
              ? "Password must be at least 6 characters"
              : ""
          }
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
          <MenuItem value="employee">Employee</MenuItem>
        </TextField>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={() => {
            setError("");
            onClose();
          }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleAdd}
          disabled={
            !fullname ||
            !email ||
            !password ||
            !role ||
            !validateEmail(email) ||
            password.length < 6
          }
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddUserDialog;
