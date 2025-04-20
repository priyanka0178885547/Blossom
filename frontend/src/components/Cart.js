import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CartPage.css";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTrash, FaHeart } from "react-icons/fa";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/cart/${userId}`);
        // Initialize quantity as 1 for each item
        const itemsWithQuantity = response.data.cart.map(item => ({
          ...item,
          quantity: 1
        }));
        setCartItems(itemsWithQuantity);
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

  const updateQuantity = (flowerId, newQuantity) => {
    if (newQuantity < 1) return; // Don't allow quantities less than 1
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item._id === flowerId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Calculate totals based on quantities
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingFee = subtotal > 0 ? 5.99 : 0;
  const tax = subtotal * 0.1;
  const total = subtotal + shippingFee + tax;

  return (
    <div className="cart-container">
      <nav className="cart-header">
        <h1>Your Shopping Cart</h1>
        <div className="header-actions">
          <button className="back-btn" onClick={() => navigate("/shop")}>
            <FaArrowLeft /> Continue Shopping
          </button>
          <div className="nav-icons">
            <div className="nav-icon" onClick={() => navigate("/wishlist")}>
              <FaHeart />
            </div>
          </div>
        </div>
      </nav>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything to your cart yet</p>
          <button className="back-btn" onClick={() => navigate("/shop")}>
            <FaArrowLeft /> Browse Flowers
          </button>
        </div>
      ) : (
        <>
          <div className="cart-grid">
            {cartItems.map((flower) => (
              <div key={flower._id} className="cart-card">
                <div className="cart-image-container">
                  <img src={flower.image} alt={flower.name} className="cart-image" />
                </div>
                <div className="cart-details">
                  <h2>{flower.name}</h2>
                  <div className="price-quantity">
                    <span className="cart-price">₹{(flower.price * flower.quantity).toFixed(2)}</span>
                    <div className="quantity-controls">
                      <button 
                        className="quantity-btn" 
                        onClick={() => updateQuantity(flower._id, flower.quantity - 1)}
                        disabled={flower.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="quantity">{flower.quantity}</span>
                      <button 
                        className="quantity-btn" 
                        onClick={() => updateQuantity(flower._id, flower.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button 
                    className="remove-btn" 
                    onClick={() => handleRemove(flower._id)}
                  >
                    <FaTrash /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="checkout-section">
            <div className="order-summary">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>₹{shippingFee.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Tax (10%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
            
            <button 
              className="checkout-btn"
              onClick={() => {
                // Prepare cart data with quantities for checkout
                const checkoutData = {
                  items: cartItems,
                  subtotal,
                  shippingFee,
                  tax,
                  total
                };
                navigate("/checkout", { state: { checkoutData } });
              }}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;