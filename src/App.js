function App() {
  // Dummy Data
  const stats = {
    totalEmployees: 42,
    totalSalary: 325000,
    departments: 5,
  };

  const recentEmployees = [
    { id: 1, name: "John Doe", role: "Frontend Developer", dept: "IT" },
    { id: 2, name: "Sarah Smith", role: "HR Manager", dept: "HR" },
    { id: 3, name: "Michael Brown", role: "Accountant", dept: "Finance" },
    { id: 4, name: "Emily White", role: "QA Tester", dept: "QA" },
  ];

  const layout = {
    display: "flex",
    height: "100vh",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f4f6f9",
  };

  const sidebar = {
    width: "220px",
    background: "#1f2937",
    color: "white",
    padding: "20px",
  };

  const sidebarItem = {
    padding: "12px",
    cursor: "pointer",
    borderRadius: "6px",
    marginBottom: "8px",
  };

  const sidebarItemHover = {
    background: "#374151",
  };

  const main = {
    flex: 1,
    padding: "25px",
  };

  const cardContainer = {
    display: "flex",
    gap: "20px",
    marginBottom: "30px",
  };

  const card = {
    flex: 1,
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  };

  const table = {
    width: "100%",
    borderCollapse: "collapse",
    background: "white",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  };

  const thTd = {
    padding: "12px",
    borderBottom: "1px solid #ddd",
    textAlign: "left",
  };

  const tableHeader = {
    background: "#e5e7eb",
    fontWeight: "bold",
  };

  return (
    <div style={layout}>
      <div style={sidebar}>
        <h2>Admin Panel</h2>
        <div style={sidebarItem}>Dashboard</div>
        <div style={sidebarItem}>Employees</div>
        <div style={sidebarItem}>Departments</div>
        <div style={sidebarItem}>Settings</div>
      </div>

      <div style={main}>
        <h1>Dashboard Overview</h1>

        <div style={cardContainer}>
          <div style={card}>
            <h3>Total Employees</h3>
            <h2>{stats.totalEmployees}</h2>
          </div>
          <div style={card}>
            <h3>Total Salary</h3>
            <h2>${stats.totalSalary.toLocaleString()}</h2>
          </div>
          <div style={card}>
            <h3>Departments</h3>
            <h2>{stats.departments}</h2>
          </div>
        </div>

        <h2>Recent Employees</h2>
        <table style={table}>
          <thead style={tableHeader}>
            <tr>
              <th style={thTd}>ID</th>
              <th style={thTd}>Name</th>
              <th style={thTd}>Role</th>
              <th style={thTd}>Department</th>
            </tr>
          </thead>
          <tbody>
            {recentEmployees.map((emp) => (
              <tr key={emp.id}>
                <td style={thTd}>{emp.id}</td>
                <td style={thTd}>{emp.name}</td>
                <td style={thTd}>{emp.role}</td>
                <td style={thTd}>{emp.dept}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
