// Fetch users from localStorage
export const getUsers = () => {
  return JSON.parse(localStorage.getItem("users")) || [];
};

// Save updated list
export const saveUsers = (users) => {
  localStorage.setItem("users", JSON.stringify(users));
};

// Add new user
export const addUser = (newUser) => {
  const users = getUsers();

  // Check if email exists
  const exists = users.some((u) => u.email === newUser.email);
  if (exists) return { success: false, message: "Email already exists" };

  users.push(newUser);
  saveUsers(users);

  return { success: true };
};

// Update user
export const updateUser = (email, updatedData) => {
  const users = getUsers();

  // Identify all admins
  const admins = users.filter((u) => u.role === "admin");

  // If changing an admin → non-admin and it's the last admin
  const currentUser = users.find((u) => u.email === email);

  if (currentUser.role === "admin" && updatedData.role !== "admin") {
    if (admins.length === 1) {
      return { success: false, message: "Cannot remove the last admin" };
    }
  }

  // Perform update
  const idx = users.findIndex((u) => u.email === email);
  users[idx] = { ...users[idx], ...updatedData };

  saveUsers(users);
  return { success: true };
};

// Delete user
export const deleteUser = (email) => {
  let users = getUsers();
  users = users.filter((u) => u.email !== email);
  saveUsers(users);
};
