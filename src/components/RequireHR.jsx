import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RequireHR = ({ children }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (user.role !== "hr" && user.role !== "admin")
    return <Navigate to="/login" />;

  return children;
};

export default RequireHR;
