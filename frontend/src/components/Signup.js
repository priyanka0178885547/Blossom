import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./signup.css";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "buyer", // Default role
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const { password, confirmPassword } = formData;
  
    if (password.length < 8) {
      setMessage("Password must be at least 8 characters long.");
      return;
    }
  
    const uppercaseRegex = /[A-Z]/;
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
  
    if (!uppercaseRegex.test(password)) {
      setMessage("Password must include at least one uppercase letter.");
      return;
    }
  
    if (!specialCharRegex.test(password)) {
      setMessage("Password must include at least one special character.");
      return;
    }
  
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
  
    const { confirmPassword: _, ...dataToSend } = formData;

    try {
      const response = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Signup failed.");
        return;
      }

      setMessage(data.message);
      if (data.message === "Signup successful!") {
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h2 className="signup-title">Create Your Account</h2>
        <form onSubmit={handleSubmit} className="signup-form">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="signup-input"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="signup-input"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="signup-input"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="signup-input"
            required
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="signup-input"
            required
          >
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
          </select>

          <button type="submit" className="signup-button">Sign Up</button>
        </form>
        {message && <p className="signup-message">{message}</p>}
      </div>
    </div>
  );
}
