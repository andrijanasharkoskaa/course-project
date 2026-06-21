import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getInitials } from "../utils/avatar";
function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [open, setOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) return null;

  const initials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`;

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <h3>My Learning</h3>

      <div style={{ position: "relative" }}>
        <button onClick={() => setOpen(!open)}>
          <div
            style={{
              width: 35,
              height: 35,
              borderRadius: "50%",
              background: "#2563eb",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {initials}
          </div>
        </button>

        {open && (
          <div
            style={{
              position: "absolute",
              right: 0,
              background: "white",
              border: "1px solid #ccc",
              padding: 10,
            }}
          >
            <p>{user.username}</p>
            <p>
              {user.firstName} {user.lastName}
            </p>

            <button onClick={logout}>Sign out</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
