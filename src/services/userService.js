// src/services/userService.js

import { saveLoginLog } from "./adminStatsService";

// Get all users
export const getUsers = () => {
  return JSON.parse(localStorage.getItem("users")) || [];
};

// Save users
export const saveUsers = (users) => {
  localStorage.setItem("users", JSON.stringify(users));
};

// Add new user (Admin creates Admin or HR)
export const addUser = (newUser) => {
  const users = getUsers();

  if (users.some((u) => u.email === newUser.email)) {
    return { success: false, message: "Email already exists" };
  }

  users.push(newUser);
  saveUsers(users);

  return { success: true };
};

// Update existing user (🔥 includes last-admin protection)
export const updateUser = (email, updatedData) => {
  const users = getUsers();
  const user = users.find((u) => u.email === email);

  if (!user) return { success: false, message: "User not found" };

  const adminCount = users.filter((u) => u.role === "admin").length;

  // BLOCK changing role of LAST ADMIN
  if (
    user.role === "admin" &&          // the user is an admin now
    adminCount === 1 &&               // only one admin exists
    updatedData.role &&               // role is being changed
    updatedData.role !== "admin"      // new role is NOT admin
  ) {
    return {
      success: false,
      message: "You cannot change the role of the last Admin!",
    };
  }

  // Apply changes safely
  const updatedUser = { ...user, ...updatedData };

  // Save back
  const updatedList = users.map((u) => (u.email === email ? updatedUser : u));
  saveUsers(updatedList);

  return { success: true };
};

// Delete user with protection (cannot delete last admin)
export const deleteUser = (email) => {
  const users = getUsers();
  const userToDelete = users.find((u) => u.email === email);

  const adminCount = users.filter((u) => u.role === "admin").length;

  // Prevent deleting last admin
  if (userToDelete?.role === "admin" && adminCount === 1) {
    return {
      success: false,
      message: "You cannot delete the last Admin!",
    };
  }

  const updated = users.filter((u) => u.email !== email);
  saveUsers(updated);

  return { success: true };
};

// Auto-create employee login when HR adds employee
export const addEmployeeLogin = (fullname, email) => {
  const users = getUsers();

  if (users.some((u) => u.email === email)) {
    return {
      success: false,
      message: "Employee login already exists",
    };
  }

  const password = Math.random().toString(36).slice(-8);

  const newUser = {
    fullname,
    email,
    password,
    role: "employee",
    status: "active",
    mustChangePassword: true,
  };

  users.push(newUser);
  saveUsers(users);

  return { success: true, password };
};

// LOGIN FUNCTION
export const loginUser = (email, password) => {
  return new Promise((resolve, reject) => {
    const users = getUsers();

    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    setTimeout(() => {
      if (user) {
        saveLoginLog(user.email, user.role);

        resolve({
          email: user.email,
          fullname: user.fullname,
          role: user.role,
          mustChangePassword: user.mustChangePassword || false,
          token: "local-token-123",
        });
      } else {
        reject("Invalid email or password");
      }
    }, 300);
  });
};
