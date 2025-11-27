// Save login logs
const saveLoginLog = (email, role) => {
  const logs = JSON.parse(localStorage.getItem("login_logs")) || [];

  logs.push({
    email,
    role,
    date: new Date().toISOString().split("T")[0],
    time: new Date().toLocaleTimeString()
  });

  localStorage.setItem("login_logs", JSON.stringify(logs));
};

export const loginUser = (email, password) => {
  return new Promise((resolve, reject) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    setTimeout(() => {
      if (user) {
        resolve({
          email: user.email,
          fullname: user.fullname,
          role: user.role,
          token: "local-token-123"
        });
      } else {
        reject("Invalid email or password");
      }
    }, 300);
  });
};
