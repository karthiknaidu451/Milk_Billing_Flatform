import React from "react";
import { Link } from "react-router-dom";





function Navbar({ onLogout }) {
  return (
    <nav className="navbar">
      <div className="brand"> Milk Point</div>
      <div className="nav-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/billing">Billing</Link>
        <Link to="/history">History</Link>
        <Link to="/contact">Contact</Link>
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
