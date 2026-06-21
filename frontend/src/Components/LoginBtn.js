import React from "react";

function LoginBtn() {
  const handleLogin = async () => {
    console.log("Login button clicked");
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "student1",
        password: "pass123",
      }),
    });

    const data = await res.json();
    console.log(data);
    alert(data.message);
  };

  return (
    <div>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default LoginBtn;
