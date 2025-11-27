// src/pages/admin/ManageUsers.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Alert,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import { getUsers, deleteUser } from "../../services/userService";

import AddUserDialog from "../../components/users/AddUserDialog";
import EditUserDialog from "../../components/users/EditUserDialog";
import DeleteConfirmDialog from "../../components/users/DeleteConfirmDialog";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [alertMsg, setAlertMsg] = useState("");

  const [addDialog, setAddDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);

  const loadUsers = () => {
    // 🔥 Only Admin + HR should be visible here
    const allUsers = getUsers();
    const filtered = allUsers.filter(
      (u) => u.role === "admin" || u.role === "hr"
    );
    setUsers(filtered);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleAddSuccess = () => {
    setAlertMsg("User created successfully!");
    loadUsers();
  };

  const handleEditSuccess = () => {
    setAlertMsg("User updated successfully!");
    loadUsers();
  };

  const handleDelete = () => {
    if (!selectedUser) return;

    const result = deleteUser(selectedUser.email);

    if (!result.success) {
      setAlertMsg(result.message);
      setDeleteDialog(false);
      return;
    }

    setAlertMsg("User deleted successfully!");
    setDeleteDialog(false);
    loadUsers();
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Manage Users (Admin & HR Only)
      </Typography>

      {alertMsg && (
        <Alert
          severity={
            alertMsg.toLowerCase().includes("cannot") ||
            alertMsg.toLowerCase().includes("error")
              ? "error"
              : "success"
          }
          sx={{ mb: 2 }}
        >
          {alertMsg}
        </Alert>
      )}

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setAddDialog(true)}
      >
        Add Admin / HR
      </Button>

      <Paper sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Full Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map((user) => (
              <TableRow key={user.email}>
                <TableCell>{user.fullname}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.status}</TableCell>

                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => {
                      setSelectedUser(user);
                      setEditDialog(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>

                  <IconButton
                    color="error"
                    onClick={() => {
                      setSelectedUser(user);
                      setDeleteDialog(true);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}

            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No Admin / HR users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* Dialog Components */}
      <AddUserDialog
        open={addDialog}
        onClose={() => setAddDialog(false)}
        onSuccess={handleAddSuccess}
      />

      <EditUserDialog
        open={editDialog}
        user={selectedUser}
        onClose={() => setEditDialog(false)}
        onSuccess={handleEditSuccess}
      />

      <DeleteConfirmDialog
        open={deleteDialog}
        user={selectedUser}
        onClose={() => setDeleteDialog(false)}
        onConfirm={handleDelete}
      />
    </Box>
  );
};

export default ManageUsers;
