import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaLock, FaCheck } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTrash, FaHeart, FaPlus, FaMinus } from "react-icons/fa";
import { GiFlowerPot } from "react-icons/gi";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/cart/${userId}`);
        const itemsWithQuantity = response.data.cart.map(item => ({
          ...item,
          quantity: 1
        }));
        setCartItems(itemsWithQuantity);
        localStorage.setItem("cart", JSON.stringify(itemsWithQuantity));
      } catch (error) {
        console.error("Error fetching cart:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchCart();
    } else {
      setIsLoading(false);
    }
  }, [userId]);

  const handleRemove = async (flowerId) => {
    try {
      await axios.post("http://localhost:5000/api/cart/remove", {
        userId,
        flowerId,
      });
      const updatedCart = cartItems.filter((flower) => flower._id !== flowerId);
      setCartItems(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } catch (error) {
      console.error("Error removing flower from cart:", error);
      setError("Failed to remove item. Please try again.");
    }
  };

  const updateQuantity = async (flowerId, change) => {
    const updatedItems = cartItems.map(item => {
      if (item._id === flowerId) {
        const newQuantity = item.quantity + change;
        return {
          ...item,
          quantity: newQuantity < 1 ? 1 : newQuantity
        };
      }
      return item;
    });

    setCartItems(updatedItems);
    localStorage.setItem("cart", JSON.stringify(updatedItems));

    try {
      await axios.post("http://localhost:5000/api/cart/update", {
        userId,
        flowerId,
        quantity: updatedItems.find(item => item._id === flowerId).quantity,
      });
    } catch (error) {
      console.error("Error updating quantity:", error);
      setError("Failed to update quantity. Please try again.");
    }
  };

  const moveToWishlist = async (flowerId) => {
    try {
      await axios.post("http://localhost:5000/api/wishlist/add", {
        userId,
        flowerId,
      });
      handleRemove(flowerId);
    } catch (error) {
      console.error("Error moving to wishlist:", error);
      setError("Failed to move to wishlist. Please try again.");
    }
  };

  const handlePlaceOrder = async () => {
    if (!userId) {
      setError("You must be logged in to place an order");
      return;
    }

    if (cartItems.length === 0) {
      setError("Your cart is empty");
      return;
    }

    setIsPlacingOrder(true);
    setError(null);

    try {
      const orderData = {
        buyer: userId,
        flowers: cartItems.map(item => ({
          flowerId: item._id,
          quantity: item.quantity
        }))
      };

      const response = await axios.post("http://localhost:5000/api/orders", orderData, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });

      // Clear cart on success
      await Promise.all(
        cartItems.map(item => 
          axios.post("http://localhost:5000/api/cart/remove", {
            userId,
            flowerId: item._id
          })
        )
      );
            setCartItems([]);
      localStorage.removeItem("cart");
      setOrderSuccess(true);
      
      setTimeout(() => {
        navigate("/orders");
      }, 2000);
    } catch (err) {
      console.error("Order failed:", err);
      setError(err.response?.data?.error || "Failed to place order. Please try again.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = subtotal > 1000 ? subtotal * 0.1 : 0;
  const deliveryCharge = subtotal > 500 ? 0 : 40;
  const total = subtotal - discount + deliveryCharge;

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="flower-spinner">
          <GiFlowerPot />
        </div>
        <p>Loading your beautiful blooms...</p>
      </div>
    );
  }

  return (
    <div className="cart-page">
      {/* Header */}
      <header className="cart-header">
        <div className="header-content">
          <h1>Your Floral Cart</h1>
          <button className="back-btn" onClick={() => navigate("/shop")}>
            <FaArrowLeft /> Continue Shopping
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="cart-main">
        {orderSuccess ? (
          <div className="order-success">
            <div className="success-icon">
              <FaCheck />
            </div>
            <h2>Order Placed Successfully!</h2>
            <p>Your flowers will be on their way soon</p>
            <p>Redirecting to your orders...</p>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-icon">
              <GiFlowerPot />
            </div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any beautiful flowers yet</p>
            <button className="shop-btn" onClick={() => navigate("/shop")}>
              Browse Our Collection
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}
              {cartItems.map((flower) => (
                <div key={flower._id} className="cart-item">
                  <div className="item-image-container">
                    <img src={flower.image} alt={flower.name} className="item-image" />
                    <div className="flower-badge">{flower.category}</div>
                  </div>
                  <div className="item-details">
                    <h3 className="item-name">{flower.name}</h3>
                    
                    <div className="price-container">
                      <div className="price-info">
                        <span className="current-price">₹{flower.price.toFixed(2)}</span>
                        {flower.originalPrice && (
                          <span className="original-price">₹{flower.originalPrice.toFixed(2)}</span>
                        )}
                      </div>
                      <div className="quantity-control">
                        <button 
                          className="quantity-btn"
                          onClick={() => updateQuantity(flower._id, -1)}
                          disabled={flower.quantity <= 1}
                        >
                          <FaMinus />
                        </button>
                        <span className="quantity">{flower.quantity}</span>
                        <button 
                          className="quantity-btn"
                          onClick={() => updateQuantity(flower._id, 1)}
                        >
                          <FaPlus />
                        </button>
                      </div>
                    </div>
                    
                    <div className="item-actions">
                      <button 
                        className="save-btn"
                        onClick={() => moveToWishlist(flower._id)}
                      >
                        <FaHeart /> Save for later
                      </button>
                      <button 
                        className="remove-btn"
                        onClick={() => handleRemove(flower._id)}
                      >
                        <FaTrash /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-summary">
              <div className="summary-card">
                <h3>Order Summary</h3>
                
                <div className="summary-row">
                  <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="summary-row discount-row">
                    <span>Discount</span>
                    <span className="discount">- ₹{discount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="summary-row">
                  <span>Delivery</span>
                  <span>{deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge.toFixed(2)}`}</span>
                </div>
                
                <div className="summary-row total-row">
                  <span>Total</span>
                  <span className="total-price">₹{total.toFixed(2)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="savings-banner">
                    <FaHeart className="heart-icon" />
                    <span>You saved ₹{discount.toFixed(2)} on this order!</span>
                  </div>
                )}
                
                <button 
                  className="checkout-btn"
                  onClick={handlePlaceOrder}
                  disabled={isPlacingOrder}
                >
                  {isPlacingOrder ? (
                    <>
                      <div className="spinner"></div>
                      Processing...
                    </>
                  ) : (
                    "Place Order"
                  )}
                </button>
                
                <div className="security-info">
                  <div className="security-badge">
                    <FaLock className="lock-icon" />
                    <span>Secure Checkout</span>
                  </div>
                  <p>100% Authentic Flowers • Free Returns</p>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      <style jsx>{`
        :root {
          --primary-color: #9c27b0;
          --secondary-color: #7b1fa2;
          --accent-color: #e91e63;
          --light-color: #f8f9fa;
          --dark-color: #212121;
          --gray-color: #757575;
          --light-gray: #e0e0e0;
          --success-color: #4caf50;
          --warning-color: #ff9800;
          --danger-color: #f44336;
          --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
          --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
          --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
          --transition: all 0.3s ease;
        }

        /* Loading State */
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background-color: #f9f9f9;
        }

        .flower-spinner {
          font-size: 3rem;
          color: var(--primary-color);
          animation: spin 2s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Error Message */
        .error-message {
          background-color: rgba(244, 67, 54, 0.1);
          color: var(--danger-color);
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          text-align: center;
          font-weight: 500;
        }

        /* Order Success State */
        .order-success {
          text-align: center;
          padding: 4rem 2rem;
          background-color: white;
          border-radius: 10px;
          box-shadow: var(--shadow-sm);
          width: 100%;
        }

        .success-icon {
          font-size: 4rem;
          color: var(--success-color);
          margin-bottom: 1.5rem;
          background-color: rgba(76, 175, 80, 0.1);
          width: 100px;
          height: 100px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .order-success h2 {
          font-size: 1.8rem;
          margin-bottom: 1rem;
          color: var(--dark-color);
        }

        .order-success p {
          color: var(--gray-color);
          margin-bottom: 0.5rem;
        }

        /* Spinner for loading state */
        .spinner {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
          margin-right: 10px;
        }

        /* Cart Page */
        .cart-page {
          background-color: #f9f9f9;
          min-height: 100vh;
        }

        /* Header */
        .cart-header {
          background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
          color: white;
          padding: 1.5rem 5%;
          box-shadow: var(--shadow-md);
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .back-btn {
          background-color: rgba(255, 255, 255, 0.2);
          color: white;
          border: none;
          padding: 0.6rem 1.2rem;
          border-radius: 50px;
          width: 200px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
          transition: var(--transition);
        }

        .back-btn:hover {
          background-color: rgba(255, 255, 255, 0.3);
          transform: translateX(-3px);
        }

        /* Main Content */
        .cart-main {
          max-width: 1200px;
          margin: 2rem auto;
          padding: 0 5%;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        @media (min-width: 992px) {
          .cart-main {
            flex-direction: row;
            align-items: flex-start;
          }
        }

        /* Empty Cart */
        .empty-cart {
          text-align: center;
          padding: 4rem 2rem;
          background-color: white;
          border-radius: 10px;
          box-shadow: var(--shadow-sm);
          width: 100%;
        }

        .empty-icon {
          font-size: 4rem;
          color: var(--primary-color);
          margin-bottom: 1.5rem;
          opacity: 0.8;
        }

        .empty-cart h2 {
          font-size: 1.8rem;
          margin-bottom: 1rem;
          color: var(--dark-color);
        }

        .empty-cart p {
          color: var(--gray-color);
          margin-bottom: 2rem;
        }

        .shop-btn {
          background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
          color: white;
          border: none;
          padding: 0.8rem 1.8rem;
          border-radius: 50px;
          font-weight: 500;
          cursor: pointer;
          transition: var(--transition);
          box-shadow: 0 4px 15px rgba(156, 39, 176, 0.3);
        }

        .shop-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(156, 39, 176, 0.4);
        }

        /* Cart Items */
        .cart-items {
          flex: 2;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .cart-item {
          background-color: white;
          border-radius: 10px;
          box-shadow: var(--shadow-sm);
          overflow: hidden;
          transition: var(--transition);
          display: flex;
          flex-direction: column;
        }

        @media (min-width: 768px) {
          .cart-item {
            flex-direction: row;
          }
        }

        .cart-item:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-md);
        }

        .item-image-container {
          position: relative;
          flex-shrink: 0;
        }

        @media (min-width: 768px) {
          .item-image-container {
            width: 200px;
          }
        }

        .item-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }

        .flower-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          background-color: var(--success-color);
          color: white;
          padding: 0.3rem 0.6rem;
          border-radius: 50px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .item-details {
          padding: 1.5rem;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .item-name {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: var(--dark-color);
        }

        .price-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .price-info {
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }

        .current-price {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--primary-color);
        }

        .original-price {
          text-decoration: line-through;
          color: var(--gray-color);
          font-size: 0.9rem;
        }

        .quantity-control {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .quantity-btn {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background-color: var(--light-gray);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition);
        }

        .quantity-btn:hover {
          background-color: var(--primary-color);
          color: white;
        }

        .quantity-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .quantity {
          min-width: 30px;
          text-align: center;
          font-weight: 600;
        }

        .item-actions {
          display: flex;
          gap: 1rem;
          margin-top: auto;
        }

        @media (max-width: 480px) {
          .item-actions {
            flex-direction: column;
          }
        }

        .save-btn, .remove-btn {
          background: none;
          border: none;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          cursor: pointer;
          padding: 0.6rem 1rem;
          border-radius: 50px;
          transition: var(--transition);
        }

        .save-btn {
          color: var(--primary-color);
          background-color: rgba(156, 39, 176, 0.1);
        }

        .save-btn:hover {
          background-color: rgba(156, 39, 176, 0.2);
        }

        .remove-btn {
          color: var(--danger-color);
          background-color: rgba(244, 67, 54, 0.1);
        }

        .remove-btn:hover {
          background-color: rgba(244, 67, 54, 0.2);
        }

        /* Order Summary */
        .order-summary {
          flex: 1;
          position: sticky;
          top: 20px;
        }

        @media (min-width: 992px) {
          .order-summary {
            min-width: 350px;
            margin-left: 2rem;
          }
        }

        .summary-card {
          background-color: white;
          border-radius: 10px;
          box-shadow: var(--shadow-sm);
          padding: 1.5rem;
        }

        .summary-card h3 {
          font-size: 1.3rem;
          margin-bottom: 1.5rem;
          padding-bottom: 0.8rem;
          border-bottom: 1px solid var(--light-gray);
          color: var(--primary-color);
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px dashed var(--light-gray);
        }

        .discount-row {
          color: var(--success-color);
        }

        .discount {
          font-weight: 600;
        }

        .total-row {
          margin: 1.5rem 0;
          padding: 1rem 0;
          border-top: 1px dashed var(--light-gray);
          border-bottom: 1px dashed var(--light-gray);
          font-size: 1.1rem;
          font-weight: 600;
        }

        .total-price {
          color: var(--primary-color);
          font-size: 1.2rem;
        }

        .savings-banner {
          background-color: rgba(76, 175, 80, 0.1);
          color: var(--success-color);
          padding: 0.8rem;
          border-radius: 8px;
          text-align: center;
          margin: 1.5rem 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          animation: pulse 2s infinite;
        }

        .heart-icon {
          color: var(--accent-color);
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }

        .checkout-btn {
          width: 100%;
          background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
          color: white;
          border: none;
          padding: 1rem;
          border-radius: 50px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
          box-shadow: 0 4px 15px rgba(156, 39, 176, 0.3);
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .checkout-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(156, 39, 176, 0.4);
        }

        .checkout-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .security-info {
          text-align: center;
          font-size: 0.8rem;
          color: var(--gray-color);
        }

        .security-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .lock-icon {
          color: var(--success-color);
        }
      `}</style>
    </div>
  );
};

export default CartPage;