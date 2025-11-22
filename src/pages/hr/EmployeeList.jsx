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
} from "@mui/material";

import AddEmployeeDialog from "./AddEmployeeDialog";
import EditEmployeeDialog from "./EditEmployeeDialog";
import ViewEmployeeProfile from "./ViewEmployeeProfile";

import {
  getEmployees,
  deleteEmployee,
  saveEmployees,
} from "../../services/employeeService";

import DeleteConfirmDialog from "../../components/DeleteConfirmDialog";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [viewEmployee, setViewEmployee] = useState(null);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

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


  // ===================== IMPORT FROM EXCEL =====================
  const importFromExcel = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const imported = XLSX.utils.sheet_to_json(sheet);

      // Clean imported data
      const cleaned = imported.map((emp, index) => ({
        id:
          emp.id ||
          `EMP${(index + 1).toString().padStart(3, "0")}`,
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
      }));

      saveEmployees(cleaned);
      loadEmployees();
      alert("Employees imported successfully!");
    };

    reader.readAsArrayBuffer(file);
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

      <AddEmployeeDialog
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSuccess={loadEmployees}
      />

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
