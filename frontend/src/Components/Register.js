import React, { useState } from "react";
import { count } from "../../../backend/models/User";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          role,
          firstName,
          lastName,
          country,
          phone,
        }),
      });

      const data = await res.json();
      console.log(data);

      alert(data.message);
    } catch (error) {
      console.error("Register error:", error);
      alert("Registration failed");
    }
  };

  return (
    <div>
      <h2>Register</h2>

      <form onSubmit={handleRegister}>
        <input
          placeholder="First Name"
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          placeholder="Last Name"
          onChange={(e) => setLastName(e.target.value)}
        />
        <input
          placeholder="Country"
          onChange={(e) => setCountry(e.target.value)}
        />
        <input placeholder="Phone" onChange={(e) => setPhone(e.target.value)} />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="student">Student</option>
          <option value="instructor">Instructor</option>
        </select>

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
