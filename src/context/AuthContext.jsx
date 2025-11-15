import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Always load user from localStorage on refresh
  useEffect(() => {
    const savedUser =
      JSON.parse(localStorage.getItem("app-user")) ||
      JSON.parse(sessionStorage.getItem("app-user"));

    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  const login = (userData, remember) => {
    setUser(userData);

    if (remember) {
      localStorage.setItem("app-user", JSON.stringify(userData));
    } else {
      sessionStorage.setItem("app-user", JSON.stringify(userData));
    }
  };

  const logout = () => {
    localStorage.removeItem("app-user");
    sessionStorage.removeItem("app-user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
