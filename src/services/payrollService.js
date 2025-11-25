const STORAGE_KEY = "payroll_records";

export const initPayrollDB = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  }
};

export const getPayrolls = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
};

export const savePayrolls = (records) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
};

const generatePayrollID = (records) => {
  if (!records.length) return "PAY001";

  const last = records[records.length - 1];
  if (!last.id || typeof last.id !== "string" || !last.id.startsWith("PAY")) {
    return `PAY${(records.length + 1).toString().padStart(3, "0")}`;
  }

  const num = parseInt(last.id.replace("PAY", ""), 10);
  const next = isNaN(num) ? records.length + 1 : num + 1;
  return `PAY${next.toString().padStart(3, "0")}`;
};

export const addPayroll = (payroll) => {
  const records = getPayrolls();

  // unique per employee per month
  const exists = records.some(
    (r) => r.employeeEmail === payroll.employeeEmail && r.month === payroll.month
  );
  if (exists) {
    return { success: false, message: "Payroll already exists for this employee and month." };
  }

  const id = generatePayrollID(records);
  records.push({ ...payroll, id, createdAt: new Date().toISOString() });

  savePayrolls(records);
  return { success: true, id };
};

export const getPayrollByEmail = (email) => {
  return getPayrolls().filter((p) => p.employeeEmail === email);
};
