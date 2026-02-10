import React, { useState, useEffect } from "react";
import Navbar from "./pages/navbar";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import BillingPage from "./pages/billing";
import History from "./pages/history";
import Contact from "./pages/contact";
import Login from "./login";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  //  restore login on refresh
  useEffect(() => {
    const storedLogin = localStorage.getItem("isLoggedIn");
    if (storedLogin === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("isLoggedIn"); // clear storage
    alert("Logged out Successfully");
    setIsLoggedIn(false);
  };

  return (
    <BrowserRouter>
      {isLoggedIn && <Navbar onLogout={logout} />}

      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />
          }
        />

        <Route
          path="/dashboard"
          element={isLoggedIn ? <Dashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/billing"
          element={isLoggedIn ? <BillingPage /> : <Navigate to="/" />}
        />
        <Route
          path="/history"
          element={isLoggedIn ? <History /> : <Navigate to="/" />}
        />
        <Route
          path="/contact"
          element={isLoggedIn ? <Contact /> : <Navigate to="/" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
