export const getSystemStats = () => {
  try {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const logs = JSON.parse(localStorage.getItem("login_logs")) || [];

    const totalAdmins = users.filter((u) => u.role === "admin").length;
    const totalHR = users.filter((u) => u.role === "hr").length;

    const today = new Date().toISOString().split("T")[0];
    const activeToday = logs.filter((l) => l.date === today).length;

    return {
      success: true,
      data: {
        totalUsers: users.length,
        totalAdmins,
        totalHR,
        activeToday,
        recentLogins: logs.slice().reverse().slice(0, 20), // last 20
      },
    };
  } catch (error) {
    return { success: false, error: "Failed to load system stats." };
  }
};
