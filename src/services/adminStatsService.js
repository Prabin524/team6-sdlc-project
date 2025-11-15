export const getSystemStats = () => {
  try {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const logs = JSON.parse(localStorage.getItem("login_logs")) || [];

    // Total users
    const totalUsers = users.length;

    // Active users today (people who logged in today)
    const today = new Date().toISOString().split("T")[0];
    const activeToday = logs.filter((log) => log.date === today).length;

    // Recent logins (last 5)
    const recentLogins = logs.slice(-5).reverse();

    return {
      success: true,
      data: { totalUsers, activeToday, recentLogins }
    };
  } catch (error) {
    return { success: false, error: "Failed to load system statistics." };
  }
};

// Save a login event (call this during login)
export const saveLoginLog = (email) => {
  const logs = JSON.parse(localStorage.getItem("login_logs")) || [];

  logs.push({
    email,
    date: new Date().toISOString().split("T")[0],
    time: new Date().toLocaleTimeString()
  });

  localStorage.setItem("login_logs", JSON.stringify(logs));
};
