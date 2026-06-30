import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import'../css/login.css'

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      alert("Please fill all fields");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const foundUser = users.find(
      (u) => u.email === formData.email
    );

    if (!foundUser) {
      alert("User not found. Please sign up first.");
      navigate("/signup");
      return;
    }

    if (foundUser.password !== formData.password) {
      alert("Incorrect password");
      return;
    }

    login(foundUser);


    navigate("/");
  };

  return (
    <main className="main-login">
    <div className="LogIn container active" id="login">
      <form className="Log" onSubmit={handleLogin}>
        <h2>Welcome Back</h2>

        <div className="form-body">
          <div className="field">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder=" "
            />
            <label htmlFor="loginEmail">Email</label>
          </div>

          <div className="field">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder=" "
            />
            <label htmlFor="loginPass">Password</label>
          </div>

          <button type="submit">Log in</button>

          <p>
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </form>

      <div className="section-log section">
        <div className="section-content">
          <h1>
            <Link to="/">KHEMET</Link>
          </h1>
          <h2>Welcome Back to Khemet</h2>
          <h3>
            Pick up where you left off and keep discovering Egypt's finest places.
          </h3>
        </div>
      </div>
      </div>
      </main>
  );
}