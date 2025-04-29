// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "./wishlist.css";
// import { useNavigate } from "react-router-dom";
// import { FaArrowLeft, FaShoppingCart, FaTrash } from "react-icons/fa";

// const WishlistPage = () => {
//   const [wishlistItems, setWishlistItems] = useState([]);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const userId = localStorage.getItem("userId");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchWishlist = async () => {
//       if (!userId) {
//         navigate("/login");
//         return;
//       }

//       try {
//         const response = await axios.get(`http://localhost:5000/api/wishlist/${userId}`);
//         setWishlistItems(response.data.wishlist || []);
//       } catch (error) {
//         console.error("Error fetching wishlist:", error);
//       }
//     };

//     fetchWishlist();
//   }, [userId, navigate]);

//   const handleRemove = async (flowerId) => {
//     try {
//       setIsProcessing(true);
//       await axios.post("http://localhost:5000/api/wishlist/remove", {
//         userId,
//         flowerId,
//       });
//       setWishlistItems(prev => prev.filter(flower => flower._id !== flowerId));
//     } catch (error) {
//       console.error("Error removing from wishlist:", error);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handleMoveToCart = async (flower) => {
//     try {
//       setIsProcessing(true);
      
//       // 1. Add to cart
//       await axios.post("http://localhost:5000/api/cart/add", {
//         userId,
//         flowerId: flower._id,
//       });
      
//       // 2. Remove from wishlist
//       await axios.post("http://localhost:5000/api/wishlist/remove", {
//         userId,
//         flowerId: flower._id,
//       });
      
//       // 3. Update both cart and wishlist in localStorage
//       const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");
//       const currentWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
      
//       localStorage.setItem("cart", JSON.stringify([...currentCart, flower._id]));
//       localStorage.setItem("wishlist", JSON.stringify(
//         currentWishlist.filter(id => id !== flower._id)
//       ));
      
//       // 4. Update local state and trigger events
//       setWishlistItems(prev => prev.filter(item => item._id !== flower._id));
//       window.dispatchEvent(new Event('storage'));
      
//     } catch (error) {
//       console.error("Error moving to cart:", error);
//     } finally {
//       setIsProcessing(false);
//     }
//   };
//   return (
//     <div className="wishlist-container">
//       <nav className="wishlist-header">
//         <h1>Your Wishlist</h1>
//         <div className="header-actions">
//           <button className="back-btn" onClick={() => navigate("/shop")}>
//             <FaArrowLeft /> Back to Shop
//           </button>
//           <div className="nav-icon" onClick={() => navigate("/cart")}>
//             <FaShoppingCart />
//             <span className="cart-count">
//               {JSON.parse(localStorage.getItem("cart") || []).length}
//             </span>
//           </div>
//         </div>
//       </nav>

//       {wishlistItems.length === 0 ? (
//         <p className="empty-wishlist">Your wishlist is empty.</p>
//       ) : (
//         <div className="wishlist-grid">
//           {wishlistItems.map((flower) => (
//             <div key={flower._id} className="wishlist-card">
//               <img src={flower.image} alt={flower.name} className="wishlist-image" />
//               <div className="wishlist-details">
//                 <h2>{flower.name}</h2>
//                 <p>Price: ₹{flower.price}</p>
//                 <div className="wishlist-actions">
//                   <button 
//                     className="move-to-cart-btn"
//                     onClick={() => handleMoveToCart(flower)}
//                     disabled={isProcessing}
//                   >
//                     <FaShoppingCart /> Move to Cart
//                   </button>
//                   <button 
//                     className="remove-btn" 
//                     onClick={() => handleRemove(flower._id)}
//                     disabled={isProcessing}
//                   >
//                     <FaTrash /> Remove
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default WishlistPage;
// 
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaShoppingCart, FaTrash, FaSpinner } from "react-icons/fa";

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [processingItem, setProcessingItem] = useState(null);
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
      setProcessingItem(flowerId);
      await axios.post("http://localhost:5000/api/wishlist/remove", {
        userId,
        flowerId,
      });
      setWishlistItems(prev => prev.filter(flower => flower._id !== flowerId));
      
      // Update localStorage
      const currentWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
      localStorage.setItem("wishlist", JSON.stringify(
        currentWishlist.filter(id => id !== flowerId)
      ));
      
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    } finally {
      setProcessingItem(null);
    }
  };

  const handleMoveToCart = async (flower) => {
    try {
      setProcessingItem(flower._id);
      
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
      setProcessingItem(null);
    }
  };

  return (
    <div style={styles.container}>
      <nav style={styles.header}>
        <h1 style={styles.headerTitle}>Your Wishlist</h1>
        <div style={styles.headerActions}>
          <button 
            style={styles.backButton}
            onClick={() => navigate("/shop")}
          >
            <FaArrowLeft style={styles.icon} /> Back to Shop
          </button>
          <div 
            style={styles.cartIcon} 
            onClick={() => navigate("/cart")}
          >
            <FaShoppingCart />
            <span style={styles.cartCount}>
              {(() => {
                try {
                  return JSON.parse(localStorage.getItem("cart") || "[]").length;
                } catch {
                  return 0;
                }
              })()}
            </span>
          </div>
        </div>
      </nav>

      {wishlistItems.length === 0 ? (
        <p style={styles.emptyMessage}>Your wishlist is empty.</p>
      ) : (
        <div style={styles.grid}>
          {wishlistItems.map((flower) => (
            <div key={flower._id} style={styles.card}>
              <div style={styles.imageContainer}>
                <img 
                  src={flower.image} 
                  alt={flower.name} 
                  style={styles.image}
                />
              </div>
              <div style={styles.details}>
                <h2 style={styles.flowerName}>{flower.name}</h2>
                <p style={styles.flowerPrice}>Price: ₹{flower.price}</p>
                <div style={styles.actions}>
                  <button 
                    style={styles.moveToCartButton}
                    onClick={() => handleMoveToCart(flower)}
                    disabled={processingItem === flower._id}
                  >
                    <FaShoppingCart style={styles.icon} /> Move to Cart
                  </button>
                  <button 
                    style={styles.removeButton}
                    onClick={() => handleRemove(flower._id)}
                    disabled={processingItem === flower._id}
                  >
                    <FaTrash style={styles.icon} /> Remove
                  </button>
                </div>
              </div>
              
              {processingItem === flower._id && (
                <div style={styles.processingOverlay}>
                  <FaSpinner style={styles.spinner} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// All styles in a single object
const styles = {
  container: {
    backgroundColor: '#f8f3ff',
    color: '#333',
    height: '100vh', // full viewport height
    width: '100vw',  // full viewport width
    overflowX: 'hidden',
    overflowY: 'auto',
    paddingBottom: '50px',
    paddingTop: '0',
    margin: '0',
  },
  
  header: {
    background: 'linear-gradient(135deg, #9d65c9, #7b4cbf)',
    color: '#fff',
    padding: '20px 5%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    marginBottom: '40px',
  },
  headerTitle: {
    fontSize: '2rem',
    fontWeight: 600,
    letterSpacing: '1px',
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: '#fff',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '30px',
    cursor: 'pointer',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s ease',
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      transform: 'translateX(-3px)',
    },
  },
  cartIcon: {
    position: 'relative',
    cursor: 'pointer',
    fontSize: '1.2rem',
    transition: 'all 0.3s ease',
    ':hover': {
      transform: 'scale(1.1)',
    },
  },
  cartCount: {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    backgroundColor: '#ff6b6b',
    color: 'white',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.7rem',
    fontWeight: 'bold',
  },
  emptyMessage: {
    textAlign: 'center',
    marginTop: '50px',
    fontSize: '1.2rem',
    color: '#333',
    opacity: 0.7,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '30px',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    position: 'relative',
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
    },
  },
  imageContainer: {
    width: '100%',
    height: '280px',
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'all 0.3s ease',
    ':hover': {
      transform: 'scale(1.1)',
    },
  },
  details: {
    padding: '20px',
  },
  flowerName: {
    fontSize: '1.2rem',
    marginBottom: '10px',
    color: '#333',
  },
  flowerPrice: {
    color: '#9d65c9',
    fontWeight: 600,
    marginBottom: '15px',
  },
  actions: {
    display: 'flex',
    gap: '10px',
    marginTop: '15px',
  },
  moveToCartButton: {
    flex: 1,
    padding: '10px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.3s ease',
    backgroundColor: '#9d65c9',
    color: 'white',
    ':hover': {
      backgroundColor: '#8a56b5',
    },
    ':disabled': {
      opacity: 0.7,
      cursor: 'not-allowed',
    },
  },
  removeButton: {
    flex: 1,
    padding: '10px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.3s ease',
    backgroundColor: '#f0f0f0',
    color: '#333',
    ':hover': {
      backgroundColor: '#e0e0e0',
    },
    ':disabled': {
      opacity: 0.7,
      cursor: 'not-allowed',
    },
  },
  icon: {
    marginRight: '5px',
  },
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    borderRadius: '12px',
  },
  spinner: {
    animation: 'spin 1s linear infinite',
    fontSize: '2rem',
    color: '#9d65c9',
  },
  '@keyframes spin': {
    to: { transform: 'rotate(360deg)' },
  },
};

export default WishlistPage;