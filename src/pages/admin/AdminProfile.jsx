import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Alert,
  Divider, Dialog, DialogActions, DialogContent, DialogTitle
} from "@mui/material";

import { useAuth } from "../../context/AuthContext";
import { getUsers, saveUsers } from "../../services/userService";

const AdminProfile = () => {
  const { user, logout, login } = useAuth();
const [confirmOpen, setConfirmOpen] = useState(false);

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [lastLogin, setLastLogin] = useState("");

  // Password change fields
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (user) {
      setFullname(user.fullname || "");
      setEmail(user.email);
      setRole(user.role);

      const logs = JSON.parse(localStorage.getItem("login_logs")) || [];
      const last = logs.reverse().find((l) => l.email === user.email);
      setLastLogin(last ? `${last.date} ${last.time}` : "N/A");
    }
  }, [user]);

  const handleProfileUpdate = () => {
  if (!fullname.trim()) {
    setErrorMsg("Full Name is required");
    setSuccessMsg("");
    return;
  }

  const users = getUsers();
  const index = users.findIndex((u) => u.email === user.email);

  const updatedUser = {
    ...users[index],
    fullname: fullname.trim(),
  };

  users[index] = updatedUser;
  saveUsers(users);

  login(updatedUser, true); 

  setSuccessMsg("Profile updated successfully!");
  setErrorMsg("");
};

  const handlePasswordChange = () => {
    const users = getUsers();
    const index = users.findIndex((u) => u.email === user.email);

    if (!oldPass || !newPass || !confirmPass) {
      setErrorMsg("All password fields are required");
      setSuccessMsg("");
      return;
    }

    if (oldPass !== users[index].password) {
      setErrorMsg("Old password is incorrect");
      setSuccessMsg("");
      return;
    }

    if (newPass.length < 6) {
      setErrorMsg("New password must be at least 6 characters");
      setSuccessMsg("");
      return;
    }

    if (newPass !== confirmPass) {
      setErrorMsg("Passwords do not match");
      setSuccessMsg("");
      return;
    }

    // Update password
    users[index].password = newPass;
    saveUsers(users);

    setSuccessMsg("Password changed successfully!");
    setErrorMsg("");

    // Reset fields
    setOldPass("");
    setNewPass("");
    setConfirmPass("");
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Admin Profile
      </Typography>

      {successMsg && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMsg}
        </Alert>
      )}

      {errorMsg && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMsg}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Profile Information
        </Typography>

        <TextField
  fullWidth
  label="Full Name"
  margin="dense"
  required
  value={fullname}
  onChange={(e) => setFullname(e.target.value)}
  error={fullname.trim() === ""}
  helperText={fullname.trim() === "" ? "Full Name is required" : ""}
/>


        <TextField
          fullWidth
          label="Email"
          margin="dense"
          value={email}
          disabled
        />

        <TextField
          fullWidth
          label="Role"
          margin="dense"
          value={role.toUpperCase()}
          disabled
        />

        <TextField
          fullWidth
          label="Last Login"
          margin="dense"
          value={lastLogin}
          disabled
        />

        <Button sx={{ mt: 2 }} variant="contained" onClick={handleProfileUpdate}>
          Update Profile
        </Button>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Change Password
        </Typography>

        <TextField
          fullWidth
          required
          type="password"
          label="Old Password"
          margin="dense"
          value={oldPass}
          onChange={(e) => setOldPass(e.target.value)}
        />

        <TextField
          fullWidth
          required
          type="password"
          label="New Password"
          margin="dense"
          value={newPass}
          onChange={(e) => setNewPass(e.target.value)}
        />

        <TextField
          fullWidth
          required
          type="password"
          label="Confirm Password"
          margin="dense"
          value={confirmPass}
          onChange={(e) => setConfirmPass(e.target.value)}
        />

       <Button
  sx={{ mt: 2 }}
  variant="contained"
  color="warning"
  onClick={() => setConfirmOpen(true)}
>
  Change Password
</Button>
<Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
  <DialogTitle>Confirm Password Change</DialogTitle>
  <DialogContent>
    <Typography>
      Are you sure you want to change your password?
    </Typography>
  </DialogContent>

  <DialogActions>
    <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>

    <Button
      variant="contained"
      color="warning"
      onClick={() => {
        setConfirmOpen(false);
        handlePasswordChange();
      }}
    >
      Yes, Change Password
    </Button>
  </DialogActions>
</Dialog>

      </Paper>
    </Box>
  );
};

export default AdminProfile;
