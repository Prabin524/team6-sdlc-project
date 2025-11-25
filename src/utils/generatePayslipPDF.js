import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generatePayslipPDF = (employee, salary) => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(18);
  doc.text("Employee Payslip", 14, 15);

  // Employee Info
  doc.setFontSize(12);
  doc.text(`Name: ${employee.fullname}`, 14, 30);
  doc.text(`Email: ${employee.email}`, 14, 38);
  doc.text(`Department: ${employee.department}`, 14, 46);

  // Salary Summary
  autoTable(doc, {
    startY: 60,
    head: [["Description", "Amount"]],
    body: [
      ["Basic Salary", `$${salary.basic}`],
      ["Tax Deduction", `-$${salary.tax}`],
      ["Net Salary", `$${salary.net}`],
    ],
  });

  // Deductions Summary
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 8,
    head: [["Deductions", "Amount"]],
    body: [
      ["CPP", `$${salary.cpp}`],
      ["EI", `$${salary.ei}`],
      ["Federal Tax", `$${salary.federalTax}`],
      ["Provincial Tax", `$${salary.provincialTax}`],
      ["Other Deductions", `$${salary.otherDeductions}`],
      ["Total Deductions", `$${salary.totalDeductions}`],
    ],
  });

  // Final Net Salary
  doc.setFontSize(12);
  doc.text(
    `Final Net Salary: $${salary.netSalary}`,
    14,
    doc.lastAutoTable.finalY + 20
  );

  // Signatures
  doc.setFontSize(10);
  doc.text(
    "HR Signature: ____________________",
    14,
    doc.lastAutoTable.finalY + 35
  );
  doc.text(
    "Employee Signature: _______________",
    110,
    doc.lastAutoTable.finalY + 35
  );

  // Save File
  const fileName = `${employee.fullname}-${salary.month}-payslip.pdf`;
  doc.save(fileName);
};
