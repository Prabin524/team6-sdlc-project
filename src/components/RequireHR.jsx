import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RequireHR = ({ children }) => {
  const { user, loading } = useAuth();

  // Wait for loading user from localStorage/sessionStorage
  if (loading) return null;

  // Not logged in
  if (!user) return <Navigate to="/login" replace />;

  // Role not allowed
  if (user.role !== "hr" && user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RequireHR;
