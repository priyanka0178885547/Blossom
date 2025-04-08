import React, { useEffect, useState } from "react";
import axios from "axios";
import "./wishlist.css"; // reuse the styling

const WishlistPage = () => {
  const [flowers, setFlowers] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(storedWishlist);

    const fetchFlowers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/flower/all");
        const allFlowers = response.data.flowers;
        const likedFlowers = allFlowers.filter(flower =>
          storedWishlist.includes(flower._id)
        );
        setFlowers(likedFlowers);
      } catch (error) {
        console.error("Error fetching flowers:", error);
      }
    };

    fetchFlowers();
  }, []);

  return (
    <div className="wishlist-container">
      <h1 className="shop-title">Your Wishlist</h1>
      {flowers.length === 0 ? (
        <p className="no-results">No liked flowers yet.</p>
      ) : (
        <div className="flower-grid">
          {flowers.map((flower) => (
            <div key={flower._id} className="flower-card">
              <img src={flower.image} alt={flower.name} className="flower-image" />
              <h2 className="flower-name">{flower.name}</h2>
              <p className="flower-price">Price: ${flower.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
