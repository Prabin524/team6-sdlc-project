import React, { useEffect, useState } from "react";
import {
  Box, Paper, Typography, Table, TableHead, TableRow,
  TableCell, TableBody, Button
} from "@mui/material";

import { useAuth } from "../../context/AuthContext";
import { getPayrollByEmail } from "../../services/payrollService";
import { generatePayslipPDF } from "../../utils/generatePayslipPDF";

const MyPayslips = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);

  useEffect(() => {
    if (user?.email) {
      setRecords(getPayrollByEmail(user.email));
    }
  }, [user]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Payslips
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Month</TableCell>
              <TableCell>Gross</TableCell>
              <TableCell>Deductions</TableCell>
              <TableCell>Net</TableCell>
              <TableCell align="right">Download</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.month}</TableCell>
                <TableCell>{r.grossSalary}</TableCell>
                <TableCell>{r.totalDeductions}</TableCell>
                <TableCell>{r.netSalary}</TableCell>
                <TableCell align="right">
                  <Button variant="contained" size="small" onClick={() => generatePayslipPDF(r)}>
                    PDF
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {records.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No payslips yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default MyPayslips;
