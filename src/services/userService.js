export const getUsers = () => {
  return JSON.parse(localStorage.getItem("users")) || [];
};

// Save users back to storage
export const saveUsers = (users) => {
  localStorage.setItem("users", JSON.stringify(users));
};

// Add User (Used only by Admin)
export const addUser = (newUser) => {
  const users = getUsers();

  if (users.some((u) => u.email === newUser.email)) {
    return { success: false, message: "Email already exists" };
  }

  users.push(newUser);
  saveUsers(users);
  return { success: true };
};

// Update user record
export const updateUser = (email, updatedData) => {
  const users = getUsers();
  const index = users.findIndex((u) => u.email === email);

  if (index === -1) return { success: false, message: "User not found" };

  users[index] = { ...users[index], ...updatedData };
  saveUsers(users);
  return { success: true };
};

// Delete a user
export const deleteUser = (email) => {
  const users = getUsers();

  const adminCount = users.filter((u) => u.role === "admin").length;
  const userToDelete = users.find((u) => u.email === email);

  //prevent deleting LAST admin
  if (userToDelete?.role === "admin" && adminCount === 1) {
    return {
      success: false,
      message: "You cannot delete the last Admin!",
    };
  }

  // Proceed to delete
  const updated = users.filter((u) => u.email !== email);
  saveUsers(updated);

  return { success: true };
};

// EMPLOYEE-AUTO-LOGIN CREATION
export const addEmployeeLogin = (fullname, email) => {
  const users = getUsers();

  // Prevent duplicate login accounts
  if (users.some((u) => u.email === email)) {
    return {
      success: false,
      message: "Employee login already exists",
    };
  }

  // Generate a simple password
  const password = Math.random().toString(36).slice(-8);

  const newUser = {
    fullname,
    email,
    password,
    role: "employee",
    status: "active",
  };

  users.push(newUser);
  saveUsers(users);

  return { success: true, password };
};
