import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RequireEmployee = ({ children }) => {
  const { user, loading } = useAuth();

  // Wait until user is loaded first
  if (loading) return null;

  // Not logged in
  if (!user) return <Navigate to="/login" replace />;

  // Only employee role allowed
  if (user.role !== "employee") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RequireEmployee;
