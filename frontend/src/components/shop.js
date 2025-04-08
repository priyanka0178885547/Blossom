


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./Shop.css"; // Import the external CSS
// import { FaShoppingCart, FaHeart } from "react-icons/fa";

// const ShopPage = () => {
//   const [flowers, setFlowers] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [translatedSearch, setTranslatedSearch] = useState("");
//   const [cart, setCart] = useState([]);

//   useEffect(() => {
//     const fetchFlowers = async () => {
//       try {
//         const response = await axios.get("http://localhost:5000/api/flower/all");
//         setFlowers(response.data.flowers); // ✅ FIXED
//       } catch (error) {
//         console.error("Error fetching flowers:", error);
//       }
//     };    
//     fetchFlowers();
//   }, []);

//   // Debounced translation function
//   useEffect(() => {
//     const debounceTimeout = setTimeout(() => {
//       if (!searchTerm) {
//         setTranslatedSearch("");
//         return;
//       }

//       const translateSearchTerm = async () => {
//         try {
//           const response = await axios.post("http://localhost:5000/api/translate", {
//             text: searchTerm,
//             targetLang: "en",
//           });
//           setTranslatedSearch(response.data.translatedText.toLowerCase());
//           console.log("Translated Text:", response.data.translatedText);
//         } catch (error) {
//           console.error("Translation Error:", error);
//         }
//       };

//       translateSearchTerm();
//     }, 500); // 500ms delay

//     return () => clearTimeout(debounceTimeout);
//   }, [searchTerm]);

//   const addToCart = (flower) => {
//     setCart((prevCart) => [...prevCart, flower]);
//   };

//   const filteredFlowers = flowers.filter((flower) =>
//     flower?.name?.toLowerCase().includes(translatedSearch)
//   );

//   return (
//     <div className="shop-container">
//       <nav className="shop-header">
//         <h1 className="shop-title">Blossom Shop</h1>
//         <input
//           type="text"
//           placeholder="Search flowers..."
//           className="search-bar"
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//         <div className="cart-info">
//         <span>
//   <FaShoppingCart style={{ marginRight: "8px" }} />
//   {cart.length}
// </span>

//         </div>
//       </nav>

//       {filteredFlowers.length === 0 ? (
//         <p className="no-results">No flowers found. Try a different search term.</p>
//       ) : (
//         <div className="flower-grid">
//           {filteredFlowers.map((flower) => (
//             <div key={flower._id} className="flower-card">
//           <img src={flower.image} alt={flower.name} className="flower-image" />

//               <h2 className="flower-name">{flower.name}</h2>
//               <p className="flower-price">Price: ${flower.price}</p>
//               <button className="add-to-cart-btn" onClick={() => addToCart(flower)}>
//                 Add to Cart
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ShopPage;
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

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const storedWishlist = localStorage.getItem("wishlist");
    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist));
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

  // Add to cart handler
  const addToCart = (flower) => {
    setCart((prevCart) => [...prevCart, flower]);
  };

  // Wishlist toggle handler
  const toggleWishlist = (flowerId) => {
    let updatedWishlist;
    if (wishlist.includes(flowerId)) {
      updatedWishlist = wishlist.filter((id) => id !== flowerId);
    } else {
      updatedWishlist = [...wishlist, flowerId];
    }
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
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

    <span className="icon-btn">
      <FaShoppingCart className="nav-icon" title="Cart" />
      {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
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
              <p className="flower-price">Price: ${flower.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopPage;
