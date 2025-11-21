// EMPLOYEE LOCAL STORAGE SERVICE

const STORAGE_KEY = "employees";

// Initialize if empty
export const initEmployeeDB = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  }
};

export const getEmployees = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
};

export const saveEmployees = (employees) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
};

export const addEmployee = (employee) => {
  const employees = getEmployees();

  // Check duplicate email
  if (employees.some((e) => e.email === employee.email)) {
    return { success: false, message: "Email already exists" };
  }

  employees.push(employee);
  saveEmployees(employees);
  return { success: true };
};

export const updateEmployee = (id, updatedData) => {
  const employees = getEmployees();
  const index = employees.findIndex((e) => e.id === id);

  if (index === -1) {
    return { success: false, message: "Employee not found" };
  }

  employees[index] = { ...employees[index], ...updatedData };
  saveEmployees(employees);

  return { success: true };
};

export const deleteEmployee = (id) => {
  const employees = getEmployees();
  const updated = employees.filter((e) => e.id !== id);
  saveEmployees(updated);
};
