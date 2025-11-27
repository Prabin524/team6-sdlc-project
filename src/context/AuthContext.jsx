import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved =
      JSON.parse(localStorage.getItem("app-user")) ||
      JSON.parse(sessionStorage.getItem("app-user"));

    if (saved) {
      setUser(saved);
    }

    setLoading(false);
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
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
