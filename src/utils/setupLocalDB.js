export const initializeLocalDB = () => {
  const existingUsers = JSON.parse(localStorage.getItem("users"));

  if (!existingUsers) {
    const defaultUsers = [
      {
        email: "admin@example.com",
        password: "admin123",
        role: "admin"
      },
      {
        email: "hr@example.com",
        password: "hr123",
        role: "hr"
      },
      {
        email: "user@example.com",
        password: "user123",
        role: "employee"
      }
    ];

    localStorage.setItem("users", JSON.stringify(defaultUsers));
  }
};
