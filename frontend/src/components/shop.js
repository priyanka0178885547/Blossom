
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Shop.css";
import { FaShoppingCart, FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ShopPage = () => {
  const [flowers, setFlowers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [translatedSearch, setTranslatedSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  // Fetch all flowers
  useEffect(() => {
    const fetchFlowers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/flower/all");
        setFlowers(response.data.flowers);
      } catch (error) {
        console.error("Error fetching flowers:", error);
      }
    };
    fetchFlowers();
  }, []);

  // Load wishlist and cart from localStorage on mount
  useEffect(() => {
    try {
      const storedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
      setWishlist(storedWishlist);
    } catch (error) {
      console.warn("Failed to parse wishlist from localStorage:", error);
      setWishlist([]);
    }
  
    try {
      const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCart(storedCart);
    } catch (error) {
      console.warn("Failed to parse cart from localStorage:", error);
      setCart([]);
    }
  }, []);
  

  // Handle translation with debounce
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (!searchTerm) {
        setTranslatedSearch("");
        return;
      }

      const translateSearchTerm = async () => {
        try {
          const response = await axios.post("http://localhost:5000/api/translate", {
            text: searchTerm,
            targetLang: "en",
          });
          setTranslatedSearch(response.data.translatedText.toLowerCase());
          console.log("Translated Text:", response.data.translatedText);
        } catch (error) {
          console.error("Translation Error:", error);
        }
      };

      translateSearchTerm();
    }, 500);

    return () => clearTimeout(debounceTimeout);
  }, [searchTerm]);

  const userId = localStorage.getItem("userId");

  const toggleWishlist = async (flowerId) => {
    try {
      const response = await axios.post("http://localhost:5000/api/wishlist/add", {
        userId,
        flowerId,
      });
      setWishlist(response.data.wishlist.flowers); // ✅ Correct path
      localStorage.setItem("wishlist", JSON.stringify(response.data.wishlist.flowers));
            localStorage.setItem("wishlist", JSON.stringify(response.data.flowerIds));  // Persist to localStorage
    } catch (error) {
      console.error("Wishlist error:", error);
    }
  };
  
  const addToCart = async (flower) => {
    try {
      const response = await axios.post("http://localhost:5000/api/cart/add", {
        userId,
        flowerId: flower._id,
      });
      setCart(response.data.flowerIds);
      localStorage.setItem("cart", JSON.stringify(response.data.flowerIds));  // Persist to localStorage
    } catch (error) {
      console.error("Cart error:", error);
    }
  };

  // Filter flowers based on search
  const filteredFlowers = flowers.filter((flower) =>
    flower?.name?.toLowerCase().includes(translatedSearch)
  );

  return (
    <div className="shop-container">
      <nav className="shop-header">
        <h1 className="shop-title">Blossom Shop</h1>

        <input
          type="text"
          placeholder="Search flowers..."
          className="search-bar"
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="icon-group">
          <span className="icon-btn" onClick={() => navigate("/wishlist")}>
            <FaHeart className="nav-icon" title="Wishlist" />
          </span>

          <span className="icon-btn" onClick={() => navigate("/cart")}>
            <FaShoppingCart className="nav-icon" title="Cart" />
          </span>

          {/* Logout Button */}
          <button className="logout-btn" onClick={() => navigate("/")}>
            Logout
          </button>
        </div>
      </nav>

      {filteredFlowers.length === 0 ? (
        <p className="no-results">No flowers found. Try a different search term.</p>
      ) : (
        <div className="flower-grid">
          {filteredFlowers.map((flower) => (
            <div key={flower._id} className="flower-card">
              <img src={flower.image} alt={flower.name} className="flower-image" />

              {/* ❤️ Wishlist Icon beside Add to Cart */}
              <div className="flower-actions">
                <button className="add-to-cart-btn" onClick={() => addToCart(flower)}>
                  Add to Cart
                </button>
                <span className="like-icon" onClick={() => toggleWishlist(flower._id)}>
                  <FaHeart
                    className="heart-icon"
                    color={wishlist.includes(flower._id) ? "red" : "#ccc"}
                    size={22}
                  />
                </span>
              </div>

              <h2 className="flower-name">{flower.name}</h2>
              <p className="flower-price">Price: ₹{flower.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopPage;
