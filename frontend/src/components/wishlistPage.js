import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Wishlist.css";
import { useNavigate } from "react-router-dom";

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!userId) {
        console.error("User ID is missing in localStorage.");
        navigate("/login"); // Redirect to login if no user ID is found
        return;
      }

      console.log(`Fetching wishlist for userId: ${userId}`);

      try {
        const response = await axios.get(`http://localhost:5000/api/wishlist/${userId}`);
        console.log("Wishlist fetched successfully:", response.data);

        // Assuming the flowers are inside 'flowers' in the response data
        setWishlistItems(response.data.wishlist || []);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };

    fetchWishlist();
  }, [userId, navigate]);

  const handleRemove = async (flowerId) => {
    console.log(`Attempting to remove flower with ID: ${flowerId}`);
    
    try {
      await axios.post("http://localhost:5000/api/wishlist/remove", {
        userId,
        flowerId,
      });
      console.log(`Removed flower with ID: ${flowerId}`);
      
      setWishlistItems((prev) => prev.filter((flower) => flower._id !== flowerId));
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  return (
    <div className="wishlist-container">
      <nav className="wishlist-header">
        <h1>Your Wishlist</h1>
        <button className="back-btn" onClick={() => navigate("/shop")}>
          Back to Shop
        </button>
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

export default WishlistPage;
