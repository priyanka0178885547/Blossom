import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Shop.css";
import { FaShoppingCart, FaHeart, FaFilter } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ShopPage = () => {
  const [flowers, setFlowers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [translatedSearch, setTranslatedSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [showColorFilter, setShowColorFilter] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'Seller';

  // Common flower colors for filtering
  const flowerColors = [
    "Red", "Pink", "White", "Yellow", 
    "Purple", "Orange", "Blue", "Green",
    "Black", "Multicolor"
  ];
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
        } catch (error) {
          console.error("Translation Error:", error);
          // Fallback to original search term if translation fails
          setTranslatedSearch(searchTerm.toLowerCase());
        }
      };

      translateSearchTerm();
    }, 500);

    return () => clearTimeout(debounceTimeout);
  }, [searchTerm]);

  // Make sure to actually use translatedSearch in your filter function
  const filteredFlowers = flowers.filter((flower) => {
    const searchQuery = translatedSearch || searchTerm.toLowerCase();
    const matchesSearch = 
      flower?.name?.toLowerCase().includes(searchQuery) || 
      flower?.color?.toLowerCase().includes(searchQuery);
    
    const matchesColor = !selectedColor || 
      flower?.color?.toLowerCase() === selectedColor.toLowerCase();
    
    return matchesSearch && matchesColor;
  });
  // Fetch all flowers with error handling
  useEffect(() => {
    const fetchFlowers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get("http://localhost:5000/api/flower/all");
        setFlowers(response.data?.flowers || []);  // Ensure we always have an array
      } catch (error) {
        console.error("Error fetching flowers:", error);
        setError("Failed to load flowers. Please try again later.");
        setFlowers([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFlowers();
  }, []);

  // Load wishlist and cart from localStorage on mount with error handling
 // Load wishlist on mount
useEffect(() => {
  try {
    const stored = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setWishlist(Array.isArray(stored) ? stored : []);
  } catch (error) {
    console.warn("Wishlist load error:", error);
    setWishlist([]);
  }
}, []);

// Load cart on mount
useEffect(() => {
  try {
    const stored = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(Array.isArray(stored) ? stored : []);
  } catch (error) {
    console.warn("Cart load error:", error);
    setCart([]);
  }
}, []);

  // Add to cart function
  // const addToCart = async (flower) => {
  //   try {
  //     const response = await axios.post("http://localhost:5000/api/cart/add", {
  //       userId: localStorage.getItem("userId"),
  //       flowerId: flower._id,
  //     });
  //     setCart(response.data.flowerIds);
  //     localStorage.setItem("cart", JSON.stringify(response.data.flowerIds));
  //   } catch (error) {
  //     console.error("Cart error:", error);
  //   }
  // };
  const addToCart = async (flower) => {
    try {
      const userId = localStorage.getItem("userId");
      
      // 1. Optimistically update UI immediately
      setCart(prevCart => {
        const newCart = [...prevCart, flower._id];
        localStorage.setItem("cart", JSON.stringify(newCart));
        return newCart;
      });
  
      // 2. Make API call
      const response = await axios.post("http://localhost:5000/api/cart/add", {
        userId: userId,
        flowerId: flower._id,
      });
  
      // 3. Verify server response and sync
      if (response.data?.flowerIds) {
        // Only update if server response differs from our optimistic update
        if (JSON.stringify(response.data.flowerIds) !== JSON.stringify([...cart, flower._id])) {
          setCart(response.data.flowerIds);
          localStorage.setItem("cart", JSON.stringify(response.data.flowerIds));
        }
      }
  
      // 4. Visual feedback
      document.querySelector('.cart-count').classList.add('pulse');
      setTimeout(() => {
        document.querySelector('.cart-count')?.classList.remove('pulse');
      }, 500);
  
    } catch (error) {
      console.error("Cart error:", error);
      // Revert on error
      setCart(prevCart => prevCart.filter(id => id !== flower._id));
      localStorage.setItem("cart", JSON.stringify(cart.filter(id => id !== flower._id)));
    }
  };

  // Toggle wishlist function
  // const toggleWishlist = async (flowerId) => {
  //   try {
  //     const response = await axios.post("http://localhost:5000/api/wishlist/add", {
  //       userId: localStorage.getItem("userId"),
  //       flowerId,
  //     });
  //     setWishlist(response.data.wishlist.flowers);
  //     localStorage.setItem("wishlist", JSON.stringify(response.data.wishlist.flowers));
  //   } catch (error) {
  //     console.error("Wishlist error:", error);
  //   }
  // };
  const toggleWishlist = async (flowerId) => {
    const userId = localStorage.getItem("userId");
  
    try {
      // Check if flower is already in wishlist
      const isInWishlist = wishlist.includes(flowerId);
  
      // Choose endpoint based on presence in wishlist
      const endpoint = isInWishlist
        ? "http://localhost:5000/api/wishlist/remove"
        : "http://localhost:5000/api/wishlist/add";
  
      const response = await axios.post(endpoint, {
        userId,
        flowerId,
      });
  
      // Update the wishlist in state and localStorage
      setWishlist(response.data.wishlist.flowers);
      localStorage.setItem("wishlist", JSON.stringify(response.data.wishlist.flowers));
    } catch (error) {
      console.error("Wishlist toggle error:", error);
    }
  };
  
 
  return (
    <div className="shop-container">
      <nav className="shop-header">
        <h1 className="shop-title">Blossom Shop</h1>

        <div className="search-filter-container">
          <input
            type="text"
            placeholder="Search flowers by name or color..."
            className="search-bar"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
          
          <div className="color-filter-wrapper">
            <button 
              className="filter-btn"
              onClick={() => setShowColorFilter(!showColorFilter)}
            >
              <FaFilter /> 
              {selectedColor && <span className="active-filter">{selectedColor}</span>}
            </button>
            
            {showColorFilter && (
              <div className="color-filter-dropdown">
                <div 
                  className="color-option" 
                  onClick={() => {
                    setSelectedColor("");
                    setShowColorFilter(false);
                  }}
                >
                  All Colors
                </div>
                {flowerColors.map((color) => (
                  <div 
                    key={color}
                    className="color-option"
                    onClick={() => {
                      setSelectedColor(color);
                      setShowColorFilter(false);
                    }}
                  >
                    <span 
                      className="color-swatch" 
                      style={{ backgroundColor: color.toLowerCase() }}
                    />
                    {color}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="icon-group">
          <span className="icon-btn" onClick={() => navigate("/wishlist")}>
            <FaHeart className="nav-icon" title="Wishlist" />
            {wishlist?.length > 0 && <span className="cart-count">{wishlist.length}</span>}
          </span>

          <span className="icon-btn" onClick={() => navigate("/cart")}>
            <FaShoppingCart className="nav-icon" title="Cart" />
            {cart?.length > 0 && <span className="cart-count">{cart.length}</span>}
          </span>

          <button className="logout-btn" onClick={() => navigate("/")}>
            Logout
          </button>
        </div>
      </nav>

      {isLoading ? (
        <div className="loading-message">Loading flowers...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : filteredFlowers?.length === 0 ? (
        <p className="no-results">
          {selectedColor 
            ? `No ${selectedColor} flowers found. Try a different color or search term.`
            : "No flowers found. Try a different search term."}
        </p>
      ) : (
        <div className="flower-grid">
          {filteredFlowers?.map((flower) => (
            <div key={flower._id} className="flower-card">
              <img src={flower.image} alt={flower.name} className="flower-image" />
              
              {flower.color && (
                <div className="flower-color-badge" style={{ backgroundColor: flower.color.toLowerCase() }}>
                  {flower.color}
                </div>
              )}

              <div className="flower-actions">
                <button className="add-to-cart-btn" onClick={() => addToCart(flower)}>
                  Add to Cart
                </button>
                <span className="like-icon" onClick={() => toggleWishlist(flower._id)}>
                  <FaHeart
                    className="heart-icon"
                    color={wishlist?.includes(flower._id) ? "red" : "#ccc"}
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