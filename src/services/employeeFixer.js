import { getEmployees, saveEmployees } from "./employeeService";

export const fixEmployeeDB = () => {
  let employees = getEmployees();
  let changed = false;

  employees = employees.map((emp, index) => {
    // Fix missing fullname/email (skip completely broken entries)
    if (!emp || typeof emp !== "object") return null;

    // Generate missing ID
    if (!emp.id || typeof emp.id !== "string" || !emp.id.startsWith("EMP")) {
      emp.id = `EMP${(index + 1).toString().padStart(3, "0")}`;
      changed = true;
    }

    // Fix improperly formatted IDs
    if (typeof emp.id !== "string") {
      emp.id = `EMP${(index + 1).toString().padStart(3, "0")}`;
      changed = true;
    }

    return emp;
  });

  // Remove null entries
  employees = employees.filter(Boolean);

  if (changed) {
    saveEmployees(employees);
    console.log("✔ Employee DB auto-fixed successfully!");
  }
};
