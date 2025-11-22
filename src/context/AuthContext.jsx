import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const STORAGE_KEY = "app-user";


  // Always load user from localStorage on refresh
  useEffect(() => {
    const savedUser =
  JSON.parse(localStorage.getItem(STORAGE_KEY)) ||
  JSON.parse(sessionStorage.getItem(STORAGE_KEY));


    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

 const login = (userData, remember = true) => {
  setUser(userData);

  if (remember) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    sessionStorage.removeItem(STORAGE_KEY);
  } else {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    localStorage.removeItem(STORAGE_KEY);
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
