import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Shop.css'; // Import the external CSS

const ShopPage = () => {
  const [flowers, setFlowers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);

  // Fetch flowers from API
  useEffect(() => {
    const fetchFlowers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/flowers');
        setFlowers(response.data);
      } catch (error) {
        console.error('Error fetching flowers:', error);
      }
    };
    fetchFlowers();
  }, []);

  // Add flower to cart
  const addToCart = (flower) => {
    setCart((prevCart) => [...prevCart, flower]);
  };

  // Filter flowers based on search term
  const filteredFlowers = flowers.filter((flower) =>
    flower?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="shop-container">
      {/* Header and Search Bar */}
      <nav className="shop-header">
        <h1 className="shop-title">Blossom Shop</h1>
        <input 
          type="text"
          placeholder="Search flowers..."
          className="search-bar"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="cart-info">
          <span>Cart: {cart.length}</span>
        </div>
      </nav>

      {/* Flower Display Section */}
      {filteredFlowers.length === 0 ? (
        <p className="no-results">No flowers found. Try a different search term.</p>
      ) : (
        <div className="flower-grid">
          {filteredFlowers.map((flower) => (
            <div key={flower._id} className="flower-card">
              <img 
                src={`http://localhost:5000/${flower.imageUrl}`} 
                alt={flower.name} 
                className="flower-image"
              />
              <h2 className="flower-name">{flower.name}</h2>
              <p className="flower-price">Price: ${flower.price}</p>
              <button 
                className="add-to-cart-btn"
                onClick={() => addToCart(flower)}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopPage;
