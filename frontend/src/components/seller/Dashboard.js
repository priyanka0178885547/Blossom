// import React, { useEffect, useState, useCallback } from 'react';
// import axios from 'axios';
// import './sellerDashboard.css';

// const SellerDashboard = () => {
//   const [flowers, setFlowers] = useState([]);
//   const [formData, setFormData] = useState({
//     name: '',
//     color: '',
//     price: '',
//     image: null,
//   });
//   const [alert, setAlert] = useState({ type: '', message: '' });

//   const token = localStorage.getItem('token');

//   // Fetch flowers
//   const fetchFlowers = useCallback(async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/flower/my-flowers', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setFlowers(response.data.flowers);
//     } catch (err) {
//       console.error('Failed to fetch flowers:', err);
//     }
//   }, [token]);

//   useEffect(() => {
//     fetchFlowers();
//   }, [fetchFlowers]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // ✅ Separate handler for file input
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     setFormData((prev) => ({
//       ...prev,
//       image: file,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const data = new FormData();
//     data.append('name', formData.name);
//     data.append('color', formData.color);
//     data.append('price', formData.price);
//     data.append('image', formData.image);

//     console.log('📦 FormData:', {
//       name: formData.name,
//       color: formData.color,
//       price: formData.price,
//       image: formData.image,
//     });

//     try {
//       await axios.post('http://localhost:5000/api/flower/add', data, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       setAlert({ type: 'success', message: 'Flower added successfully!' });
//       setFormData({ name: '', color: '', price: '', image: null });
//       fetchFlowers();

//       setTimeout(() => setAlert({ type: '', message: '' }), 3000);
//     } catch (err) {
//       console.error('Add flower error:', err);
//       setAlert({ type: 'error', message: 'Failed to add flower' });
//     }
//   };

//   const deleteFlower = async (id) => {
//     try {
//       await axios.delete(`http://localhost:5000/api/flower/delete/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setAlert({ type: 'success', message: 'Flower deleted successfully!' });
//       fetchFlowers();

//       setTimeout(() => setAlert({ type: '', message: '' }), 3000);
//     } catch (err) {
//       console.error('Delete error:', err);
//       setAlert({ type: 'error', message: 'Failed to delete flower' });
//     }
//   };

//   return (
//     <div className="dashboard-container">
//       <h2 className="section-title">Seller Dashboard</h2>

//       {alert.message && (
//         <div className={`alert ${alert.type === 'success' ? 'alert-success' : 'alert-error'}`}>
//           {alert.message}
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="add-flower-form">
//         <input
//           type="text"
//           name="name"
//           placeholder="Flower Name"
//           value={formData.name}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="text"
//           name="color"
//           placeholder="Flower Color"
//           value={formData.color}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="number"
//           name="price"
//           placeholder="Price"
//           value={formData.price}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="file"
//           name="image"
//           accept="image/*"
//           onChange={handleFileChange}
//           required
//         />
//         <button type="submit">Add Flower</button>
//       </form>

//       <h3 className="section-title">Your Flowers</h3>
//       <div className="flower-list">
//         {flowers.length > 0 ? (
//           flowers.map((flower) => (
//             <div key={flower._id} className="flower-card">
//               <img src={flower.image} alt={flower.name} />
//               <h3>{flower.name}</h3>
//               <p>Color: {flower.color}</p>
//               <p>Price: ₹{flower.price}</p>
//               <button className="delete-button" onClick={() => deleteFlower(flower._id)}>
//                 Delete
//               </button>
//             </div>
//           ))
//         ) : (
//           <p>No flowers added yet.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SellerDashboard;

import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FiPlus, FiTrash2, FiEdit, FiShoppingBag, FiDollarSign, 
  FiTag, FiCheckCircle, FiAlertCircle, FiUser, FiLogOut,
  FiSearch, FiRefreshCw ,FiShoppingCart
} from 'react-icons/fi';
import styles from './sellerDashboard.module.css'; // Updated import
import { px } from 'framer-motion';

const SellerDashboard = () => {
  const [flowers, setFlowers] = useState([]);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userName = localStorage.getItem('userName') || 'Seller';

  const fetchFlowers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/flower/my-flowers', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFlowers(response.data.flowers);
    } catch (err) {
      console.error('Failed to fetch flowers:', err);
      setAlert({ type: 'error', message: 'Failed to load flowers' });
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [token]);

  useEffect(() => {
    fetchFlowers();
  }, [fetchFlowers]);
  // Add this edit function
  const editFlower = (id) => {
    navigate(`/edit-flower/${id}`);
  };
  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchFlowers();
  };
  const handleOrderClick = () => {
    // Navigate to the order page when the button is clicked
    navigate('/SellerOrders');  // Replace '/order' with the actual route path
  };
  const deleteFlower = async (id) => {
    if (window.confirm('Are you sure you want to delete this flower?')) {
      try {
        await axios.delete(`http://localhost:5000/api/flower/delete/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAlert({ type: 'success', message: 'Flower deleted successfully!' });
        // Animate out the deleted flower
        setFlowers(prev => prev.filter(f => f._id !== id));
        setTimeout(() => setAlert({ type: '', message: '' }), 3000);
      } catch (err) {
        console.error('Delete error:', err);
        setAlert({ type: 'error', message: 'Failed to delete flower' });
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  const filteredFlowers = flowers.filter(flower =>
    flower.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    flower.color.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className={styles.sellerDashboard}>
      {/* Navbar */}
      <nav className={styles.dashboardNavbar}>
        <div className={styles.navbarBrand}>
          <FiShoppingBag className={styles.brandIcon} />
          <span>FloralHub</span>
        </div>
        
        <div className={styles.searchBar}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search flowers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className={styles.userActions}>
          <div className={styles.userProfile}>
            <div className={styles.userAvatar}>
              <FiUser />
            </div>
            <span className={styles.userName}>{userName}</span>
          </div>
          
          <button className={styles.orderBtn} onClick={handleOrderClick}>
            <FiShoppingCart />
            Order
          </button>
          
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <FiLogOut />
          </button>
        </div>
      </nav>
  
      {/* Main Content */}
      <main className={styles.dashboardMain}>
        {alert.message && (
          <div className={`${styles.alertMessage} ${styles[alert.type]}`}>
            {alert.type === 'success' ? 
              <FiCheckCircle className={styles.alertIcon} /> : 
              <FiAlertCircle className={styles.alertIcon} />
            }
            <span>{alert.message}</span>
          </div>
        )}
  
        <div className={styles.dashboardHeader}>
          <div className={styles.headerTitleContainer}>
            <h1 className={styles.headerTitle}>
              <span className={styles.titleGradient}>My Flower Inventory</span>
              <span className={styles.flowerDecor}>🌸</span>
            </h1>
            <p className={styles.headerSubtitle}>Manage your beautiful floral collection</p>
          </div>
          
          <div className={styles.headerActions}>
            <button 
              className={`${styles.headerButton} ${styles.refreshBtn}`}
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <FiRefreshCw className={`${styles.buttonIcon} ${isRefreshing ? styles.spinning : ""}`} />
              <span className={styles.buttonText}>Refresh</span>
              <span className={styles.buttonHoverEffect}></span>
            </button>
            
            <button 
              className={`${styles.headerButton} ${styles.addFlowerBtn}`}
              onClick={() => navigate('/AddFlower')}
            >
              <FiPlus className={styles.buttonIcon} />
              <span className={styles.buttonText}>Add New Flower</span>
              <span className={styles.buttonHoverEffect}></span>
            </button>
          </div>
        </div>
  
        <div className={styles.statsCards}>
          <div className={`${styles.statCard} ${styles.totalListings}`}>
            <div className={styles.cardBackground}></div>
            <FiShoppingBag className={styles.statIcon} />
            <div className={styles.statContent}>
              <h3 data-count={flowers.length}>{flowers.length}</h3>
              <p>Total Listings</p>
            </div>
            <div className={styles.cardDecor1}></div>
            <div className={styles.cardDecor2}></div>
          </div>
          
          <div className={`${styles.statCard} ${styles.activeListings}`}>
            <div className={styles.cardBackground}></div>
            <FiTag className={styles.statIcon} />
            <div className={styles.statContent}>
              <h3 data-count={flowers.length}>{flowers.length}</h3>
              <p>Active Listings</p>
            </div>
            <div className={styles.cardDecor1}></div>
            <div className={styles.cardDecor2}></div>
          </div>
          
          <div className={`${styles.statCard} ${styles.totalValue}`}>
            <div className={styles.cardBackground}></div>
            <FiDollarSign className={styles.statIcon} />
            <div className={styles.statContent}>
              <h3>₹{flowers.reduce((sum, flower) => sum + parseFloat(flower.price), 0).toFixed(2)}</h3>
              <p>Total Inventory Value</p>
            </div>
            <div className={styles.cardDecor1}></div>
            <div className={styles.cardDecor2}></div>
          </div>
        </div>
  
        <div className={styles.flowersContainer}>
          {loading ? (
            <div className={styles.loadingState}>
              <div className={styles.loadingSpinner}>
                <div className={styles.spinnerInner}></div>
                <div className={styles.spinnerFlower}>🌼</div>
              </div>
              <p>Loading your beautiful flowers...</p>
            </div>
          ) : filteredFlowers.length > 0 ? (
            <div className={styles.flowerGrid}>
              {filteredFlowers.map((flower) => (
                <div key={flower._id} className={styles.flowerCard}>
                  <div className={styles.flowerImageContainer}>
                    <img 
                      src={flower.image} 
                      alt={flower.name} 
                      className={styles.flowerImage}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x200?text=Flower+Image';
                      }}
                    />
                    <div className={styles.flowerActions}>
                      <button 
                        className={styles.actionBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/edit-flower/${flower._id}`);
                        }}
                        title="Edit"
                      >
                        <FiEdit className={styles.actionIcon} />
                      </button>
                      <button 
                        className={`${styles.actionBtn} ${styles.deleteBtn}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteFlower(flower._id);
                        }}
                        title="Delete"
                      >
                        <FiTrash2 className={styles.actionIcon} />
                      </button>
                    </div>
                    <div className={styles.flowerRibbon} style={{ backgroundColor: flower.color.toLowerCase() }}></div>
                  </div>
                  <div className={styles.flowerDetails}>
                    <h3 className={styles.flowerName}>{flower.name}</h3>
                    <div className={styles.flowerMeta}>
                      <span className={styles.flowerPrice}>
                        ₹{flower.price}
                      </span>
                      <span className={styles.flowerColorTag} style={{ 
                        backgroundColor: `${flower.color.toLowerCase()}20`,
                        color: flower.color.toLowerCase()
                      }}>
                        {flower.color}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIllustration}>
                <FiShoppingBag className={styles.emptyIcon} />
                <div className={styles.emptyPetal}></div>
                <div className={styles.emptyPetal}></div>
                <div className={styles.emptyPetal}></div>
              </div>
              <h3>No flowers found</h3>
              <p>{searchTerm ? 'Try a different search term' : 'Your garden is waiting for flowers!'}</p>
              <button 
                className={styles.addFlowerBtn}
                onClick={() => navigate('/AddFlower')}
              >
                <FiPlus />
                Add Your First Flower
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SellerDashboard;