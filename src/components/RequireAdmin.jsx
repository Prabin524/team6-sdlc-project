import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RequireAdmin = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null; // WAIT UNTIL USER IS LOADED

  if (!user) return <Navigate to="/login" replace />;

  if (user.role !== "admin") return <Navigate to="/login" replace />;

  return children;
};

export default RequireAdmin;
