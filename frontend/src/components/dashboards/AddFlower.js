import React, { useState } from "react";

export default function AddFlower() {
  const [formData, setFormData] = useState({
    name: "",
    color: "",
    price: "",
    imageUrl: "",
  });

  const [message, setMessage] = useState("");

  // 🔐 Replace this with actual auth logic (e.g., from context or Redux)
  const userId = localStorage.getItem("userId"); // assuming userId is saved in localStorage

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:5000/api/users/${userId}/flowers/add-flower/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Error adding flower");
      } else {
        setMessage("Flower added successfully!");
        setFormData({ name: "", color: "", price: "", imageUrl: "" });
      }
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>Add New Flower</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input
          type="text"
          name="name"
          placeholder="Flower Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="color"
          placeholder="Color"
          value={formData.color}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="imageUrl"
          placeholder="Image URL"
          value={formData.imageUrl}
          onChange={handleChange}
        />
        <button type="submit">Add Flower</button>
      </form>
      {message && <p style={{ marginTop: "10px", color: "green" }}>{message}</p>}
    </div>
  );
}
