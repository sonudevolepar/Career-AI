import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <Link to="/" className="navbar-logo">
          Career AI
        </Link>

        {/* Navigation */}
        <div className="navbar-links">

          <Link to="/" className="nav-link">
            Home
          </Link>

          <Link to="/resume-analyzer" className="nav-link">
            Resume
          </Link>

          <Link to="/dsa-coach" className="nav-link">
            DSA
          </Link>

          <Link to="/mock-interview" className="nav-link">
            Interview
          </Link>

          <Link to="/ai-roadmap" className="nav-link">
            Roadmap
          </Link>

          <Link to="/system-design" className="nav-link">
            System Design
          </Link>

          <Link to="/job-search" className="nav-link">
            Jobs
          </Link>

          {/* Authentication */}
          {user ? (
            <>
              {user.role === "admin" && (
                <Link to="/admin" className="admin-btn">
                  Admin
                </Link>
              )}

              <span className="user-name">
                {user.name}
              </span>

              <button
                onClick={logout}
                className="logout-btn"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="login-btn">
                Login
              </Link>

              <Link to="/register" className="register-btn">
                Register
              </Link>
            </>
          )}

        </div>
      </div>
    </nav>
  );
};

export default Navbar;