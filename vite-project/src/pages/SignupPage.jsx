import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../theme.css";

function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
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
        <p className="auth-title">Access // Signup</p>
        <p className="auth-subtitle">Dummy signup page. No backend auth is applied.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
            />
          </div>

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
              placeholder="Create password"
            />
          </div>

          <button className="btn btn-primary" type="submit">
            Create account
          </button>
        </form>

        <p className="auth-footnote">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;