import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  FiPackage, FiUser, FiDollarSign, FiCalendar, 
  FiCheckCircle, FiClock, FiXCircle, FiSearch,
  FiCheck, FiX, FiLoader
} from 'react-icons/fi';
import styles from './SellerOrders.module.css';

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const sellerId = localStorage.getItem('userId');
  const [updatingOrder, setUpdatingOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/orders/seller/${sellerId}`);
        setOrders(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [sellerId]);

  const filteredOrders = orders.filter(order => 
    order.buyer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.flowers.some(flower => 
      flower.flowerId?.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdatingOrder(orderId);
      await axios.put(
        `http://localhost:5000/api/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error('Status update failed:', err);
    } finally {
      setUpdatingOrder(null);
    }
  };

  const getStatusControls = (order) => {
    if (order.status === 'accepted') {
      return (
        <span className={styles.statusBadgeAccepted}>
          <FiCheckCircle /> Approved
        </span>
      );
    }

    return (
      <div className={styles.statusControls}>
        <button
          className={`${styles.statusButton} ${styles.approveButton}`}
          onClick={() => handleStatusUpdate(order._id, 'accepted')}
          disabled={updatingOrder === order._id}
        >
          {updatingOrder === order._id ? <FiLoader className={styles.spin} /> : <FiCheck />}
          Approve
        </button>
        
        {order.status === 'not accepted' && (
          <span className={styles.statusBadgeRejected}>
            <FiX /> Rejected
          </span>
        )}
      </div>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorCard}>
          <FiPackage className={styles.errorIcon} />
          <h3>Error Loading Orders</h3>
          <p>{error}</p>
          <button 
            className={styles.retryButton}
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.sellerOrdersContainer}>
      <div className={styles.headerSection}>
        <h1>
          <FiPackage /> Your Orders
        </h1>
        <div className={styles.searchContainer}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className={styles.emptyState}>
          <FiPackage className={styles.emptyIcon} />
          <h3>No Orders Found</h3>
          <p>{searchTerm ? 'Try a different search term' : 'You have no orders yet'}</p>
        </div>
      ) : (
        <div className={styles.ordersList}>
          {filteredOrders.map((order) => (
            <div key={order._id} className={styles.orderCard}>
              <div className={styles.orderHeader}>
                <div className={styles.orderId}>Order #{order._id.slice(-6).toUpperCase()}</div>
                <div className={styles.orderDate}>
                  <FiCalendar /> {formatDate(order.orderedAt)}
                </div>
                {getStatusControls(order)}
              </div>

              <div className={styles.customerInfo}>
                <FiUser className={styles.customerIcon} />
                <div>
                  <h4>{order.buyer?.name || 'Unknown Customer'}</h4>
                  <p className={styles.customerEmail}>{order.buyer?.email || ''}</p>
                </div>
              </div>

              <div className={styles.orderItems}>
                <h4>Items Ordered:</h4>
                {order.flowers.map((item, index) => (
                  <div key={index} className={styles.orderItem}>
                    <div className={styles.itemImageContainer}>
                      {item.flowerId?.image ? (
                        <img 
                          src={item.flowerId.image} 
                          alt={item.flowerId.name} 
                          className={styles.itemImage}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/100?text=Flower';
                          }}
                        />
                      ) : (
                        <div className={styles.imagePlaceholder}>
                          <FiPackage />
                        </div>
                      )}
                    </div>
                    <div className={styles.itemDetails}>
                      <h5>{item.flowerId?.name || 'Unknown Flower'}</h5>
                      <div className={styles.itemMeta}>
                        <span>Quantity: {item.quantity}</span>
                        <span>Price: ₹{item.price?.toFixed(2) || '0.00'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.orderFooter}>
                <div className={styles.orderTotal}>
                  <FiDollarSign /> Total: ₹{order.totalPrice?.toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerOrders;