import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../theme.css";

function LoginPage() {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="shell">
      <div className="auth-card">
        <p className="auth-title">Login</p>
        <p className="auth-subtitle">Dummy login page. No authentication is applied.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
          </div>

          <div className="field-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
            />
          </div>

          <button className="btn btn-primary" type="submit">
            Enter dashboard
          </button>
        </form>

        <p className="auth-footnote">
          No account? <Link to="/signup">Create one</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;