import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert
} from "@mui/material";

import AddEmployeeDialog from "./AddEmployeeDialog";
import EditEmployeeDialog from "./EditEmployeeDialog";
import ViewEmployeeProfile from "./ViewEmployeeProfile";

import {
  getEmployees,
  deleteEmployee,
  saveEmployees,
} from "../../services/employeeService";

import { getUsers, saveUsers } from "../../services/userService";

import DeleteConfirmDialog from "../../components/DeleteConfirmDialog";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { message } from "antd";

// Allowed departments
const VALID_DEPARTMENTS = ["HR", "Finance", "Engineering", "Marketing", "Operations"];

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [viewEmployee, setViewEmployee] = useState(null);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  // Excel preview state
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState([]);

  const loadEmployees = () => {
    setEmployees(getEmployees());
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  // ===================== EXPORT TO EXCEL =====================
  const exportToExcel = () => {
    const dataToExport = employees.map(({ photo, ...rest }) => rest);

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(file, "employees.xlsx");
  };

  // ===================== IMPORT WITH VALIDATION + PREVIEW =====================
  const importFromExcel = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const imported = XLSX.utils.sheet_to_json(sheet);

      const existingEmployees = getEmployees();
      const existingUsers = getUsers();

      const validated = imported.map((emp, index) => {
        const row = {
          id: emp.id || `EMP${(index + 1).toString().padStart(3, "0")}`,
          fullname: emp.fullname || "",
          email: emp.email || "",
          phone: emp.phone || "",
          dob: emp.dob || "",
          joinDate: emp.joinDate || "",
          department: emp.department || "",
          jobTitle: emp.jobTitle || "",
          salary: emp.salary || "",
          manager: emp.manager || "",
          photo: emp.photo || null,
          error: "",
        };

        // ---------- VALIDATION ----------
        if (!row.fullname) row.error = "Missing fullname";
        else if (!row.email) row.error = "Missing email";
        else if (!/\S+@\S+\.\S+/.test(row.email)) row.error = "Invalid email";
        else if (existingEmployees.some((e) => e.email === row.email))
          row.error = "Duplicate email (existing employee)";
        else if (existingUsers.some((u) => u.email === row.email))
          row.error = "Duplicate email (user login exists)";
        else if (!VALID_DEPARTMENTS.includes(row.department))
          row.error = "Invalid department";
        else if (!row.jobTitle) row.error = "Missing job title";
        else if (new Date(row.joinDate) <= new Date(row.dob))
          row.error = "Join Date must be after DOB";

        return row;
      });

      setPreviewData(validated);
      setPreviewOpen(true);
    };

    reader.readAsArrayBuffer(file);
  };

  // ===================== CONFIRM IMPORT =====================
const confirmImport = () => {
  const validRows = previewData.filter((row) => row.error === "");

  // Get current employees
  const existing = getEmployees();

  // Merge without duplicates
  const merged = [
    ...existing,
    ...validRows.filter(
      (imp) => !existing.some((ex) => ex.email === imp.email)
    )
  ];

  // Save to localStorage
  saveEmployees(merged);

  // Auto-create login accounts
  const users = getUsers();
  validRows.forEach((emp) => {
    if (!users.some((u) => u.email === emp.email)) {
      users.push({
        fullname: emp.fullname,
        email: emp.email,
        password: Math.random().toString(36).slice(-8),
        role: "employee",
      });
    }
  });

  saveUsers(users);

  // Close preview dialog
  setPreviewOpen(false);

  // Reload employee list UI
  loadEmployees();

  message("Employees imported successfully!");
};

  // ===================== RENDER =====================
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Employee Management
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Button variant="contained" onClick={() => setOpenAdd(true)}>
          Add Employee
        </Button>

        <Button variant="outlined" onClick={exportToExcel}>
          Export to Excel
        </Button>

        <Button variant="outlined" component="label">
          Import Excel
          <input
            type="file"
            hidden
            accept=".xlsx,.xls"
            onChange={importFromExcel}
          />
        </Button>
      </Box>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Full Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Join Date</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {employees.map((emp) => (
              <TableRow key={emp.id}>
                <TableCell>{emp.fullname}</TableCell>
                <TableCell>{emp.email}</TableCell>
                <TableCell>{emp.department}</TableCell>
                <TableCell>{emp.joinDate}</TableCell>

                <TableCell>
                  <Button
                    size="small"
                    variant="outlined"
                    color="primary"
                    onClick={() => setViewEmployee(emp)}
                    sx={{ mr: 1 }}
                  >
                    View
                  </Button>

                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => setSelectedEmployee(emp)}
                    sx={{ mr: 1 }}
                  >
                    Edit
                  </Button>

                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={() => {
                      setEmployeeToDelete(emp);
                      setOpenDeleteDialog(true);
                    }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {employees.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No employees yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* ===================== IMPORT PREVIEW MODAL ===================== */}
      <Dialog open={previewOpen} fullWidth maxWidth="lg">
        <DialogTitle>Preview Imported Employees</DialogTitle>
        <DialogContent>
          {previewData.some((row) => row.error) && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Some rows contain errors. Fix your Excel and re-upload.
            </Alert>
          )}

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Full Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Job Title</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {previewData.map((row, idx) => (
                <TableRow key={idx} sx={{ bgcolor: row.error ? "#ffebee" : "#e8f5e9" }}>
                  <TableCell>{row.fullname}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.department}</TableCell>
                  <TableCell>{row.jobTitle}</TableCell>
                  <TableCell>
                    {row.error ? (
                      <Typography color="error">{row.error}</Typography>
                    ) : (
                      <Typography color="green">OK</Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            disabled={previewData.some((row) => row.error)}
            onClick={confirmImport}
          >
            Confirm Import
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add/Edit/View/Delete */}
      <AddEmployeeDialog open={openAdd} onClose={() => setOpenAdd(false)} onSuccess={loadEmployees} />

      {selectedEmployee && (
        <EditEmployeeDialog
          open={Boolean(selectedEmployee)}
          onClose={() => setSelectedEmployee(null)}
          employee={selectedEmployee}
          onSuccess={loadEmployees}
        />
      )}

      {viewEmployee && (
        <ViewEmployeeProfile
          open={Boolean(viewEmployee)}
          onClose={() => setViewEmployee(null)}
          employee={viewEmployee}
        />
      )}

      <DeleteConfirmDialog
        open={openDeleteDialog}
        title="Delete Employee"
        message={`Are you sure you want to delete ${employeeToDelete?.fullname}?`}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={() => {
          deleteEmployee(employeeToDelete.id);
          setOpenDeleteDialog(false);
          loadEmployees();
        }}
      />
    </Box>
  );
};

export default EmployeeList;
