// EMPLOYEE LOCAL STORAGE SERVICE

const STORAGE_KEY = "employees";
const USER_KEY = "users";

// Initialize if empty
export const initEmployeeDB = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  }
};

// Get users table
const getUsers = () => JSON.parse(localStorage.getItem(USER_KEY)) || [];
const saveUsers = (users) =>
  localStorage.setItem(USER_KEY, JSON.stringify(users));

export const getEmployees = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
};

export const saveEmployees = (employees) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
};

// Create employee + login user together
export const addEmployee = (employee) => {
  const employees = getEmployees();
  const users = getUsers();

  // Duplicate email in employees
  if (employees.some((e) => e.email === employee.email)) {
    return { success: false, message: "Employee email already exists" };
  }

  // Duplicate email in users (login table)
  if (users.some((u) => u.email === employee.email)) {
    return { success: false, message: "Login already exists for this email" };
  }

  // Generate password = emp123
  const password = "emp123";

  // Save employee record
  employees.push({ ...employee, password });
  saveEmployees(employees);

  // Create login user
  const newUser = {
    email: employee.email,
    password,
    role: "employee",
    fullname: employee.fullname,
  };

  users.push(newUser);
  saveUsers(users);

  return {
    success: true,
    login: newUser, // useful for popup
    message: "Employee and login created successfully",
  };
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
  return { success: true };
};
