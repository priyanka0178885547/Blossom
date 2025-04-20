// BuyerDashboard.js
import React from "react";
import { Link } from "react-router-dom";

const BuyerDashboard = () => {
  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Buyer Dashboard</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <Link to="/add-flower" style={buttonStyle}>
          ➕ Add New Flower
        </Link>

        <Link to="/my-orders" style={buttonStyle}>
          📦 View My Orders
        </Link>

        <Link to="/my-flowers" style={buttonStyle}>
          🌼 My Flower Listings
        </Link>
      </div>
    </div>
  );
};

const buttonStyle = {
  display: "block",
  padding: "12px 20px",
  backgroundColor: "#f472b6",
  color: "white",
  border: "none",
  borderRadius: "8px",
  textDecoration: "none",
  textAlign: "center",
  fontSize: "16px",
};

export default BuyerDashboard;
