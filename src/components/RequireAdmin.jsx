import React from "react";
import { useAuth } from "../context/AuthContext";
import AccessDenied from "./AccessDenied";

const RequireAdmin = ({ children }) => {
  const { user } = useAuth();

  if (!user) return <AccessDenied />;  // user not loaded yet

  if (user.role !== "admin") return <AccessDenied />;

  return children;
};

export default RequireAdmin;
