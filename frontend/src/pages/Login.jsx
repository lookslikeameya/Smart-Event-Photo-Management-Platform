import { useState } from "react";
import "./Login.css";
import api from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await api.post("/accounts/login/", {
      email: email,
      password: password,
    });

    // SAVE TOKENS
    localStorage.setItem("access", res.data.access);
    localStorage.setItem("refresh", res.data.refresh);

    alert("Login successful!");
  } catch (err) {
    if (err.response) {
      alert(err.response.data?.non_field_errors || "Login failed");
    } else {
      alert("Server error");
    }
  }
};



  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
