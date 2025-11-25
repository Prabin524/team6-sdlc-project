import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";

// FIX employee DB mismatched formats (your module)
import { fixEmployeeDB } from "./services/employeeFixer";

// For first-time login system (default accounts)
import { initializeLocalDB } from "./services/initService";

// Run initializers once
initializeLocalDB();
fixEmployeeDB();

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
