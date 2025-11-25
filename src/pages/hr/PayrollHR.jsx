import React, { useEffect, useMemo, useState } from "react";
import {
  Box, Paper, Typography, Grid, TextField, MenuItem,
  Button, Alert, Table, TableHead, TableRow, TableCell, TableBody
} from "@mui/material";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import { getEmployees } from "../../services/employeeService";
import { initPayrollDB, getPayrolls, addPayroll } from "../../services/payrollService";
import { generatePayslipPDF } from "../../utils/generatePayslipPDF";

const PayrollHR = () => {
  const [employees, setEmployees] = useState([]);
  const [records, setRecords] = useState([]);

  const [employeeEmail, setEmployeeEmail] = useState("");
  const [month, setMonth] = useState("");

  // Earnings
  const [basicSalary, setBasicSalary] = useState("");
  const [allowances, setAllowances] = useState("");
  const [overtimeHours, setOvertimeHours] = useState("");
  const [overtimeRate, setOvertimeRate] = useState("");

  // Deductions rates (configurable)
  const [cppRate, setCppRate] = useState(5.95);        // %
  const [eiRate, setEiRate] = useState(1.66);          // %
  const [federalTaxRate, setFederalTaxRate] = useState(10); // %
  const [provTaxRate, setProvTaxRate] = useState(5);   // %
  const [otherDeductions, setOtherDeductions] = useState("");

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const loadAll = () => {
    initPayrollDB();
    setEmployees(getEmployees());
    setRecords(getPayrolls());
  };

  useEffect(() => {
    loadAll();
  }, []);

  const selectedEmp = useMemo(
    () => employees.find((e) => e.email === employeeEmail),
    [employees, employeeEmail]
  );

  // auto calculations
  const overtimePay = (Number(overtimeHours) || 0) * (Number(overtimeRate) || 0);
  const grossSalary =
    (Number(basicSalary) || 0) +
    (Number(allowances) || 0) +
    overtimePay;

  const cpp = grossSalary * (Number(cppRate) || 0) / 100;
  const ei = grossSalary * (Number(eiRate) || 0) / 100;
  const federalTax = grossSalary * (Number(federalTaxRate) || 0) / 100;
  const provincialTax = grossSalary * (Number(provTaxRate) || 0) / 100;
  const otherDed = Number(otherDeductions) || 0;

  const totalDeductions = cpp + ei + federalTax + provincialTax + otherDed;
  const netSalary = grossSalary - totalDeductions;

  const handleSavePayroll = () => {
    setErrorMsg("");
    setSuccessMsg("");

    if (!employeeEmail || !month || !basicSalary) {
      setErrorMsg("Employee, Month, and Basic Salary are required.");
      return;
    }

    const payload = {
      employeeEmail,
      employeeName: selectedEmp?.fullname || "",
      department: selectedEmp?.department || "",
      month,

      basicSalary: Number(basicSalary) || 0,
      allowances: Number(allowances) || 0,
      overtimeHours: Number(overtimeHours) || 0,
      overtimeRate: Number(overtimeRate) || 0,
      overtimePay,

      cpp: Number(cpp.toFixed(2)),
      ei: Number(ei.toFixed(2)),
      federalTax: Number(federalTax.toFixed(2)),
      provincialTax: Number(provincialTax.toFixed(2)),
      otherDeductions: otherDed,

      grossSalary: Number(grossSalary.toFixed(2)),
      totalDeductions: Number(totalDeductions.toFixed(2)),
      netSalary: Number(netSalary.toFixed(2)),
    };

    const res = addPayroll(payload);
    if (!res.success) {
      setErrorMsg(res.message);
      return;
    }

    setSuccessMsg("Payroll saved successfully!");
    loadAll();
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(records);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Payroll");

    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const file = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(file, "payroll-records.xlsx");
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Payroll Management
      </Typography>

      {successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}
      {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Create Payroll
        </Typography>

        <Grid container spacing={2}>
          {/* Employee + Month */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              select
              label="Select Employee"
              value={employeeEmail}
              onChange={(e) => setEmployeeEmail(e.target.value)}
            >
              {employees.map((emp) => (
                <MenuItem key={emp.id} value={emp.email}>
                  {emp.fullname} ({emp.email})
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="month"
              label="Payroll Month"
              InputLabelProps={{ shrink: true }}
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            />
          </Grid>

          {/* Earnings */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              required
              type="number"
              label="Basic Salary"
              value={basicSalary}
              onChange={(e) => setBasicSalary(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              type="number"
              label="Allowances"
              value={allowances}
              onChange={(e) => setAllowances(e.target.value)}
            />
          </Grid>
          <Grid item xs={6} md={2}>
            <TextField
              fullWidth
              type="number"
              label="OT Hours"
              value={overtimeHours}
              onChange={(e) => setOvertimeHours(e.target.value)}
            />
          </Grid>
          <Grid item xs={6} md={2}>
            <TextField
              fullWidth
              type="number"
              label="OT Rate"
              value={overtimeRate}
              onChange={(e) => setOvertimeRate(e.target.value)}
            />
          </Grid>

          {/* Deduction rates */}
          <Grid item xs={6} md={3}>
            <TextField
              fullWidth
              type="number"
              label="CPP Rate (%)"
              value={cppRate}
              onChange={(e) => setCppRate(e.target.value)}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField
              fullWidth
              type="number"
              label="EI Rate (%)"
              value={eiRate}
              onChange={(e) => setEiRate(e.target.value)}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField
              fullWidth
              type="number"
              label="Federal Tax (%)"
              value={federalTaxRate}
              onChange={(e) => setFederalTaxRate(e.target.value)}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField
              fullWidth
              type="number"
              label="Provincial Tax (%)"
              value={provTaxRate}
              onChange={(e) => setProvTaxRate(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              type="number"
              label="Other Deductions"
              value={otherDeductions}
              onChange={(e) => setOtherDeductions(e.target.value)}
            />
          </Grid>

          {/* Calculated summary */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2, background: "#fafafa" }}>
              <Typography>Overtime Pay: {overtimePay.toFixed(2)}</Typography>
              <Typography>Gross Salary: {grossSalary.toFixed(2)}</Typography>
              <Typography>Total Deductions: {totalDeductions.toFixed(2)}</Typography>
              <Typography variant="h6">
                Net Salary: {netSalary.toFixed(2)}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Button variant="contained" onClick={handleSavePayroll}>
              Save Payroll
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Payroll history */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6">Payroll History</Typography>
          <Button variant="outlined" onClick={exportExcel}>
            Export Excel
          </Button>
        </Box>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Month</TableCell>
              <TableCell>Employee</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Gross</TableCell>
              <TableCell>Deductions</TableCell>
              <TableCell>Net</TableCell>
              <TableCell align="right">Payslip</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.month}</TableCell>
                <TableCell>{r.employeeName}</TableCell>
                <TableCell>{r.employeeEmail}</TableCell>
                <TableCell>{r.grossSalary}</TableCell>
                <TableCell>{r.totalDeductions}</TableCell>
                <TableCell>{r.netSalary}</TableCell>
                <TableCell align="right">
                  <Button size="small" variant="contained" onClick={() => generatePayslipPDF(
    {
      fullname: r.employeeName,
      email: r.employeeEmail,
      department: r.department
    },
    {
      basic: r.basicSalary,
      tax: r.totalDeductions,
      net: r.netSalary,
      cpp: r.cpp,
      ei: r.ei,
      federalTax: r.federalTax,
      provincialTax: r.provincialTax,
      otherDeductions: r.otherDeductions,
      totalDeductions: r.totalDeductions,
      netSalary: r.netSalary,
      month: r.month
    }
)}
>
                    PDF
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {records.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No payroll records yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default PayrollHR;
