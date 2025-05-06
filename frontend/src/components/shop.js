import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Shop.css";
import { FaShoppingCart, FaHeart, FaFilter, FaComment, FaTimes , FaClipboardList } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { GoogleGenerativeAI } from "@google/generative-ai";
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet"></link>
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
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
    const messagesEndRef = useRef(null);
    // Scroll to bottom whenever messages change
    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
    const handleSendMessage = async () => {
      if (!inputMessage.trim()) return;
      const userMessage = { text: inputMessage, sender: "user" };
      setMessages(prev => [...prev, userMessage]);
      setInputMessage("");
      setIsTyping(true);
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `
        You are "Blossom Buddy", the AI assistant for Blossom Shop plant nursery. 
        Your role is to help customers with:
        1. Plant care instructions including:
           - Ideal climate conditions (temperature, humidity)
           - Soil type requirements
           - Sunlight needs (full sun, partial shade, etc.)
           - Watering frequency
        2. Plant selection based on:
           - Growing conditions (indoor/outdoor)
           - Maintenance level
           - Purpose (air purification, flowering, etc.)
        3. Troubleshooting common plant problems
        4. Seasonal plant care tips
    
        Guidelines:
        - Respond in friendly, plant-themed language (use plant emojis occasionally)
        - For care questions, provide specific details about:
          * Ideal temperature range
          * Humidity preferences
          * Soil composition (e.g., well-draining, acidic, etc.)
          * Light requirements
          * Watering schedule
        - Keep answers concise but informative (3-5 sentences max)
        - Always end with a related question to continue conversation
    
        Example responses:
        "🌿 Snake plants thrive in 60-85°F temperatures and prefer well-draining soil. 
        They're drought-tolerant - water only when soil is completely dry. 
        Perfect for beginners! What other low-maintenance plants interest you?"
    
        "🌸 Hydrangeas prefer morning sun and afternoon shade in warmer climates. 
        They need moist, fertile soil with pH 5.5-6.5 for blue flowers. 
        Would you like tips on adjusting soil pH?"
    
        Current Conversation:
        ${messages.slice(-3).map(m => `${m.sender}: ${m.text}`).join('\n')}
    
        User's query: ${inputMessage}
    
        Respond helpfully as the plant expert:
        `;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        setMessages(prev => [...prev, { 
          text: text, 
          sender: "ai",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } catch (error) {
        console.error("Error with Gemini:", error);
        setMessages(prev => [...prev, { 
          text: "🌱 Sorry, I'm having trouble connecting. Please try again or visit our nursery for expert advice!", 
          sender: "ai",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } finally {
        setIsTyping(false);
      }
    };
  

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

  const filteredFlowers = flowers.filter((flower) => {
    // If no search term and no color selected, show all flowers
    if (!searchTerm && !selectedColor) return true;
    
    const searchQuery = (translatedSearch || searchTerm).toLowerCase();
    const flowerColor = flower?.color?.toLowerCase() || '';
    const flowerName = flower?.name?.toLowerCase() || '';
    
    // Check search term match
    const searchMatch = searchTerm 
      ? flowerName.includes(searchQuery) || flowerColor.includes(searchQuery)
      : true;
    
    // Check color match
    const colorMatch = selectedColor 
      ? flowerColor === selectedColor.toLowerCase()
      : true;
    
    return searchMatch && colorMatch;
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
  onClick={() => {
    console.log('Before toggle:', showColorFilter); // Debug log
    setShowColorFilter(!showColorFilter);
    console.log('After toggle:', !showColorFilter); // Debug log
  }}
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
      setSelectedColor(color.toLowerCase()); // Store lowercase
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

    <span className="icon-btn" onClick={() => navigate("/orders")}>
      <FaClipboardList className="nav-icon" title="Orders" />
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
      {/* Enhanced Chat Toggle */}
      <div 
        className={`chat-toggle ${showChat ? 'active' : ''}`} 
        onClick={() => setShowChat(!showChat)}
        title="Flower Assistant"
      >
        {showChat ? (
          <FaTimes className="chat-icon" />
        ) : (
          <>
            <FaComment className="chat-icon" />
            <span className="notification-badge">!</span>
          </>
        )}
      </div>

      {/* Enhanced Chat Box */}
{showChat && (
  <div className="chat-container">
    <div className="chat-header">
      <div className="assistant-info">
        <div className="assistant-avatar">🌱</div>
        <div>
          <h3>Blossom Buddy</h3>
          <p className="status">Online - Plant Care Specialist</p>
        </div>
      </div>
      <button 
        className="minimize-btn"
        onClick={() => setShowChat(false)}
      >
        &ndash;
      </button>
    </div>

    <div className="chat-messages">
      {messages.length === 0 ? (
        <div className="welcome-message">
          <p>🌿 <strong>Hello! I'm Blossom Buddy - Your Plant Care Assistant</strong></p>
          <p>I can help you with:</p>
          <ul>
            <li>Choosing the perfect plants for your space and climate</li>
            <li>Detailed plant care instructions (soil, light, water needs)</li>
            <li>Troubleshooting common plant problems</li>
            <li>Seasonal plant care recommendations</li>
          </ul>
          <p>What would you like help with today?</p>
        </div>
      ) : (
        messages.map((msg, index) => (
          <div 
            key={index} 
            className={`message ${msg.sender}`}
          >
            {msg.sender === 'ai' && (
              <div className="message-avatar">
                {msg.sender === 'ai' ? '🌿' : '👤'}
              </div>
            )}
            <div className="message-content">
              <div className="message-text">{msg.text}</div>
              {msg.timestamp && (
                <div className="message-time">{msg.timestamp}</div>
              )}
            </div>
          </div>
        ))
      )}
      {isTyping && (
        <div className="message ai typing">
          <div className="message-avatar">🌱</div>
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>

    <div className="chat-input-container">
      <input
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        placeholder="Ask about plants, care tips, or growing conditions..."
        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        className="chat-input"
      />
      <button 
        onClick={handleSendMessage}
        disabled={!inputMessage.trim()}
        className="send-button"
      >
        Send
      </button>
    </div>

    <div className="quick-suggestions">
      <p>Quick questions:</p>
      <button onClick={() => setInputMessage("What are the best indoor plants for beginners?")}>
        Beginner plants
      </button>
      <button onClick={() => setInputMessage("How often should I water my snake plant?")}>
        Watering tips
      </button>
      <button onClick={() => setInputMessage("What soil is best for succulents?")}>
        Soil types
      </button>
    </div>
  </div>
)}
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