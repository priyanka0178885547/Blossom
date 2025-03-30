import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation after successful signup
import "./signup.css"; // Ensure correct import for signup.css

export default function Signup() {
  // State to store form data (name, email, password)
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  // State to store the message (success or error)
  const [message, setMessage] = useState("");
  // Initialize navigate for redirecting after successful signup
  const navigate = useNavigate();

  // Function to handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      // Send the form data to the backend via a POST request
      const response = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // If the response is not ok, throw an error
      if (!response.ok) {
        throw new Error("Signup failed with status " + response.status);
      }

      // Parse the response data
      const data = await response.json();
      setMessage(data.message); // Display the message from the server

      // If the signup is successful, redirect to the login page
      if (data.message === "Signup successful!") {
        navigate("/login"); // Redirect to login page
      }
    } catch (error) {
      setMessage("Error: " + error.message); // Display an error message if the request fails
    }
  };

  // Render the Signup component
  return (
    <div className="signup-container">
      <h2 className="signup-title">Signup</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange} // Update form data on input change
          className="signup-input"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange} // Update form data on input change
          className="signup-input"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange} // Update form data on input change
          className="signup-input"
          required
        />
        <button type="submit" className="signup-button">
          Sign Up
        </button>
      </form>
      {message && <p className="signup-message">{message}</p>} {/* Display success or error message */}
    </div>
  );
}
