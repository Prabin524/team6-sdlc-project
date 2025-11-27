// src/components/users/EditUserDialog.jsx
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

import { updateUser } from "../../services/userService";

const EditUserDialog = ({ open, onClose, user, onSuccess }) => {
  const [fullname, setFullname] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setFullname(user.fullname || "");
      setRole(user.role || "");
      setError("");
    }
  }, [user]);

  const handleSave = () => {
    if (!fullname || !role) {
      setError("Full Name and Role are required");
      return;
    }

    // 🔥 Block changing to employee from this dialog
    if (role === "employee") {
      setError("You cannot change role to Employee here.");
      return;
    }

    const result = updateUser(user.email, { fullname, role });

    if (!result.success) {
      setError(result.message);
      return;
    }

    onSuccess();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Edit User</DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Email"
          margin="dense"
          disabled
          value={user?.email || ""}
        />

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
        <Button variant="contained" onClick={handleSave}>
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditUserDialog;
