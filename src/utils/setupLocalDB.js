export const initializeLocalDB = () => {
  const existingUsers = JSON.parse(localStorage.getItem("users"));

  if (!existingUsers) {
    const defaultUsers = [
        {
    fullname: "System Administrator",
    email: "admin@example.com",
    password: "admin123",
    role: "admin"
  },
  {
    fullname: "Human Resource Manager",
    email: "hr@example.com",
    password: "hr123",
    role: "hr"
  },
  {
    fullname: "General Employee",
    email: "user@example.com",
    password: "user123",
    role: "employee"
  }

    ];

    localStorage.setItem("users", JSON.stringify(defaultUsers));
  }
};
