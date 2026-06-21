import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import "../styles/App.css";

function Layout() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setOpen(false);
    navigate("/login");
  };

  const isInstructor = user?.role === "instructor";
  const isStudent = user?.role === "student";

  return (
    <div>
      {/* NAVBAR */}
      <div className="hero">
        {/* LOGO */}
        <div className="logo-container">
          <h2 style={{ color: "#2563eb" }}>LearnHub</h2>
        </div>

        {/* NAV LINKS */}
        <nav className="nav-container">
          <ul>
            <li>
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                Home
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/courses"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                Courses
              </NavLink>
            </li>

            {/* STUDENT */}
            {isStudent && (
              <li>
                <NavLink
                  to="/my-learning"
                  className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                  My Courses
                </NavLink>
              </li>
            )}

            {/* INSTRUCTOR */}
            {isInstructor && (
              <li>
                <NavLink
                  to="/instructor"
                  className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                  Instructor Dashboard
                </NavLink>
              </li>
            )}
          </ul>
        </nav>

        {/* AUTH */}
        <div className="auth-buttons">
          {user ? (
            <div style={{ position: "relative" }}>
              {/* AVATAR */}
              <img
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`}
                alt="avatar"
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
                onClick={() => setOpen(!open)}
              />

              {/* DROPDOWN */}
              {open && (
                <div style={styles.dropdown}>
                  <p style={{ margin: 0 }}>
                    <b>{user.username}</b>
                  </p>

                  <p style={{ fontSize: 12 }}>
                    {user.firstName} {user.lastName}
                  </p>

                  <hr />

                  {/* STUDENT */}
                  {isStudent && (
                    <button
                      style={styles.item}
                      onClick={() => {
                        setOpen(false);
                        navigate("/my-learning");
                      }}
                    >
                      My Courses
                    </button>
                  )}

                  {/* INSTRUCTOR */}
                  {isInstructor && (
                    <button
                      style={styles.item}
                      onClick={() => {
                        setOpen(false);
                        navigate("/instructor");
                      }}
                    >
                      Instructor Dashboard
                    </button>
                  )}

                  <button style={styles.item} onClick={handleSignOut}>
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <NavLink to="/login">
                <button className="btn btn-login">Login</button>
              </NavLink>

              <NavLink to="/register">
                <button className="btn btn-register">Register</button>
              </NavLink>
            </>
          )}
        </div>
      </div>

      {/* PAGE CONTENT */}
      <Outlet />
    </div>
  );
}

export default Layout;

/* STYLES */
const styles = {
  dropdown: {
    position: "absolute",
    right: 0,
    top: 45,
    background: "white",
    border: "1px solid #ddd",
    borderRadius: 8,
    width: 180,
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    padding: 10,
    zIndex: 1000,
  },

  item: {
    width: "100%",
    background: "none",
    border: "none",
    textAlign: "left",
    padding: "8px 0",
    cursor: "pointer",
  },
};
