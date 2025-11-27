export const initializeLocalDB = () => {
  const existingUsers = JSON.parse(localStorage.getItem("users"));

  if (!existingUsers || existingUsers.length === 0) {
    const defaultUsers = [
      {
        fullname: "System Administrator",
        email: "admin@mail.com",
        password: "admin123",
        role: "admin"
      }
    ];

    localStorage.setItem("users", JSON.stringify(defaultUsers));
  }
};
