// SAVE LOGIN RECORD
export const saveLoginLog = (email, role) => {
  const logs = JSON.parse(localStorage.getItem("login_logs")) || [];

  logs.push({
    email,
    role,                                // ⭐ FIX: store role
    date: new Date().toISOString().split("T")[0],
    time: new Date().toLocaleTimeString(),
  });

  localStorage.setItem("login_logs", JSON.stringify(logs));
};

// GET SYSTEM STATISTICS
export const getSystemStats = () => {
  try {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const logs = JSON.parse(localStorage.getItem("login_logs")) || [];

    const totalAdmins = users.filter((u) => u.role === "admin").length;
    const totalHR = users.filter((u) => u.role === "hr").length;

    const today = new Date().toISOString().split("T")[0];
    const activeToday = logs.filter((l) => l.date === today).length;

    const recentLogins = logs.slice().reverse().slice(0, 10);

    return {
      success: true,
      data: {
        totalUsers: users.length,
        totalAdmins,
        totalHR,
        activeToday,
        recentLogins,
      },
    };
  } catch (error) {
    return { success: false, error: "Failed to load system stats." };
  }
};
