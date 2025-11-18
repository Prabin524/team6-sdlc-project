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
          role: user.role,
          fullname: user.fullName,
          token: "local-token-123"
        });
      } else {
        reject("Invalid email or password");
      }
    }, 500);
  });
};
