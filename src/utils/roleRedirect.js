export const redirectToRole = (navigate, role) => {
  if (role === "admin") navigate("/admin/dashboard");
  if (role === "hr") navigate("/hr/dashboard");
  if (role === "employee") navigate("/employee");
};
