import React, { useEffect, useState } from "react";
import axios from "axios";
import "./wishlist.css";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaShoppingCart, FaTrash } from "react-icons/fa";

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!userId) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/wishlist/${userId}`);
        setWishlistItems(response.data.wishlist || []);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };

    fetchWishlist();
  }, [userId, navigate]);

  const handleRemove = async (flowerId) => {
    try {
      setIsProcessing(true);
      await axios.post("http://localhost:5000/api/wishlist/remove", {
        userId,
        flowerId,
      });
      setWishlistItems(prev => prev.filter(flower => flower._id !== flowerId));
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMoveToCart = async (flower) => {
    try {
      setIsProcessing(true);
      
      // 1. Add to cart
      await axios.post("http://localhost:5000/api/cart/add", {
        userId,
        flowerId: flower._id,
      });
      
      // 2. Remove from wishlist
      await axios.post("http://localhost:5000/api/wishlist/remove", {
        userId,
        flowerId: flower._id,
      });
      
      // 3. Update both cart and wishlist in localStorage
      const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");
      const currentWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
      
      localStorage.setItem("cart", JSON.stringify([...currentCart, flower._id]));
      localStorage.setItem("wishlist", JSON.stringify(
        currentWishlist.filter(id => id !== flower._id)
      ));
      
      // 4. Update local state and trigger events
      setWishlistItems(prev => prev.filter(item => item._id !== flower._id));
      window.dispatchEvent(new Event('storage'));
      
    } catch (error) {
      console.error("Error moving to cart:", error);
    } finally {
      setIsProcessing(false);
    }
  };
  return (
    <div className="wishlist-container">
      <nav className="wishlist-header">
        <h1>Your Wishlist</h1>
        <div className="header-actions">
          <button className="back-btn" onClick={() => navigate("/shop")}>
            <FaArrowLeft /> Back to Shop
          </button>
          <div className="nav-icon" onClick={() => navigate("/cart")}>
            <FaShoppingCart />
            <span className="cart-count">
              {JSON.parse(localStorage.getItem("cart") || []).length}
            </span>
          </div>
        </div>
      </nav>

      {wishlistItems.length === 0 ? (
        <p className="empty-wishlist">Your wishlist is empty.</p>
      ) : (
        <div className="wishlist-grid">
          {wishlistItems.map((flower) => (
            <div key={flower._id} className="wishlist-card">
              <img src={flower.image} alt={flower.name} className="wishlist-image" />
              <div className="wishlist-details">
                <h2>{flower.name}</h2>
                <p>Price: ₹{flower.price}</p>
                <div className="wishlist-actions">
                  <button 
                    className="move-to-cart-btn"
                    onClick={() => handleMoveToCart(flower)}
                    disabled={isProcessing}
                  >
                    <FaShoppingCart /> Move to Cart
                  </button>
                  <button 
                    className="remove-btn" 
                    onClick={() => handleRemove(flower._id)}
                    disabled={isProcessing}
                  >
                    <FaTrash /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;