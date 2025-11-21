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
import { getEmployees, deleteEmployee } from "../../services/employeeService";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [viewEmployee, setViewEmployee] = useState(null); 

  const loadEmployees = () => {
    setEmployees(getEmployees());
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Employee Management
      </Typography>

      <Button variant="contained" onClick={() => setOpenAdd(true)} sx={{ mb: 2 }}>
        Add Employee
      </Button>

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
                      if (window.confirm("Are you sure you want to delete this employee?")) {
                        deleteEmployee(emp.id);
                        loadEmployees();
                      }
                    }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
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
    </Box>
  );
};

export default EmployeeList;
