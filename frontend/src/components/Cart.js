import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CartPage.css";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const userId = localStorage.getItem("userId"); // 🔐 Adjust as needed
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/cart/${userId}`);
        setCartItems(response.data.cart);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    fetchCart();
  }, [userId]);

  const handleRemove = async (flowerId) => {
    try {
      await axios.post("http://localhost:5000/api/cart/remove", {
        userId,
        flowerId,
      });
      setCartItems((prev) => prev.filter((flower) => flower._id !== flowerId));
    } catch (error) {
      console.error("Error removing flower from cart:", error);
    }
  };

  return (
    <div className="cart-container">
      <nav className="cart-header">
        <h1>Your Cart</h1>
        <button className="back-btn" onClick={() => navigate("/shop")}>
          Back to Shop
        </button>
      </nav>

      {cartItems.length === 0 ? (
        <p className="empty-cart">Your cart is empty.</p>
      ) : (
        <div className="cart-grid">
          {cartItems.map((flower) => (
            <div key={flower._id} className="cart-card">
              <img src={flower.image} alt={flower.name} className="cart-image" />
              <div className="cart-details">
                <h2>{flower.name}</h2>
                <p>Price: ${flower.price}</p>
                <button className="remove-btn" onClick={() => handleRemove(flower._id)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CartPage;
