// local Databbase
const DB_VERSION = 1;

export const initializeLocalDB = () => {
  const existingUsers = JSON.parse(localStorage.getItem("users"));
  const existingVersion = Number(localStorage.getItem("db-version")) || 0;

  // for first login User and Password
  const shouldInitialize =
    !existingUsers || existingUsers.length === 0 || existingVersion < DB_VERSION;

  if (shouldInitialize) {
    const defaultUsers = [
      {
        fullname: "System Admin",
        email: "admin@mail.com",
        password: "admin123",
        role: "admin",
      },
      {
        fullname: "Human Resource Manager",
        email: "hr@mail.com",
        password: "hr123",
        role: "hr",
      },
      {
        fullname: "Employee",
        email: "employee@mail.com",
        password: "user123",
        role: "employee",
      },
    ];

    localStorage.setItem("users", JSON.stringify(defaultUsers));
    localStorage.setItem("db-version", DB_VERSION);
    console.log("%cLocal DB initialized with default users.", "color: green");
  }
};
