import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaBoxOpen, FaCheckCircle, FaTimesCircle, FaClock, FaArrowLeft } from 'react-icons/fa';
import { GiFlowerPot } from 'react-icons/gi';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/orders/buyer/${userId}`);
        setOrders(response.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchOrders();
    } else {
      navigate('/login');
    }
  }, [userId, navigate]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
        return <FaCheckCircle className="status-icon accepted" />;
      case 'not accepted':
        return <FaTimesCircle className="status-icon not-accepted" />;
      default:
        return <FaClock className="status-icon pending" />;
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="flower-spinner">
          <GiFlowerPot />
        </div>
        <p>Loading your floral history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-card">
          <FaBoxOpen className="error-icon" />
          <h2>Oops!</h2>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="retry-btn"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <div className="orders-header">
        <button
          onClick={() => navigate(-1)}
          className="back-btn"
        >
          <FaArrowLeft /> Back
        </button>
        <h1>Your Flower Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="empty-orders">
          <GiFlowerPot className="empty-icon" />
          <h2>No Orders Yet</h2>
          <p>Your order history will appear here once you make your first purchase</p>
          <button
            onClick={() => navigate('/shop')}
            className="shop-btn"
          >
            Browse Flowers
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-id">Order #{order._id.slice(-6).toUpperCase()}</div>
                <div className="order-date">{formatDate(order.orderedAt)}</div>
                <div className={`order-status ${order.status}`}>
                  {getStatusIcon(order.status)}
                  <span>{order.status}</span>
                </div>
              </div>
              
              <div className="order-items">
                {order.flowers.map((item, index) => (
                  <div key={index} className="order-item">
                    <div className="item-image-container">
                      {item.flowerId?.image ? (
                        <img src={item.flowerId.image} alt={item.flowerId.name} />
                      ) : (
                        <div className="image-placeholder">
                          <GiFlowerPot />
                        </div>
                      )}
                    </div>
                    <div className="item-details">
                      <h3>{item.flowerId?.name || 'Unknown Flower'}</h3>
                      <div className="item-meta">
                        <span>Quantity: {item.quantity}</span>
                        <span>Price: ₹{item.price?.toFixed(2) || '0.00'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="order-footer">
                <div className="order-total">
                  Total: ₹{order.totalPrice?.toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        :root {
          --primary-color: #9c27b0;
          --secondary-color: #7b1fa2;
          --accent-color: #e91e63;
          --light-color: #f8f9fa;
          --dark-color: #212121;
          --gray-color: #757575;
          --light-gray: #e0e0e0;
          --success-color: #4caf50;
          --warning-color: #ff9800;
          --danger-color: #f44336;
          --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
          --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
          --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
          --transition: all 0.3s ease;
        }

        /* Loading State */
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background-color: var(--light-color);
        }

        .flower-spinner {
          font-size: 3rem;
          color: var(--primary-color);
          animation: spin 2s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .loading-container p {
          margin-top: 1rem;
          color: var(--gray-color);
        }

        /* Error State */
        .error-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 1rem;
          background-color: var(--light-color);
        }

        .error-card {
          background-color: white;
          border-radius: 8px;
          padding: 2rem;
          text-align: center;
          box-shadow: var(--shadow-md);
          max-width: 400px;
          width: 100%;
        }

        .error-icon {
          font-size: 3rem;
          color: var(--danger-color);
          margin-bottom: 1rem;
        }

        .error-card h2 {
          color: var(--dark-color);
          margin-bottom: 0.5rem;
        }

        .error-card p {
          color: var(--gray-color);
          margin-bottom: 1.5rem;
        }

        .retry-btn {
          background-color: var(--primary-color);
          color: white;
          border: none;
          padding: 0.6rem 1.2rem;
          border-radius: 4px;
          cursor: pointer;
          transition: var(--transition);
        }

        .retry-btn:hover {
          background-color: var(--secondary-color);
        }

        /* Orders Container */
        .orders-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }

        .orders-header {
          display: flex;
          align-items: center;
          margin-bottom: 2rem;
        }

        .back-btn {
          display: flex;
          align-items: center;
          background-color: var(--light-gray);
          color: var(--primary-color);
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          margin-right: 1rem;
          transition: var(--transition);
        }

        .back-btn:hover {
          background-color: #e0d0e3;
        }

        .orders-header h1 {
          color: var(--dark-color);
          font-size: 1.8rem;
          margin: 0;
        }

        /* Empty Orders */
        .empty-orders {
          text-align: center;
          padding: 3rem;
          background-color: white;
          border-radius: 8px;
          box-shadow: var(--shadow-sm);
        }

        .empty-icon {
          font-size: 3rem;
          color: var(--primary-color);
          margin-bottom: 1rem;
          opacity: 0.7;
        }

        .empty-orders h2 {
          color: var(--dark-color);
          margin-bottom: 0.5rem;
        }

        .empty-orders p {
          color: var(--gray-color);
          margin-bottom: 1.5rem;
        }

        .shop-btn {
          background-color: var(--primary-color);
          color: white;
          border: none;
          padding: 0.8rem 1.5rem;
          border-radius: 4px;
          cursor: pointer;
          transition: var(--transition);
        }

        .shop-btn:hover {
          background-color: var(--secondary-color);
        }

        /* Orders List */
        .orders-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .order-card {
          background-color: white;
          border-radius: 8px;
          box-shadow: var(--shadow-sm);
          overflow: hidden;
          transition: var(--transition);
        }

        .order-card:hover {
          box-shadow: var(--shadow-md);
          transform: translateY(-2px);
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background-color: #f5f5f5;
          border-bottom: 1px solid var(--light-gray);
        }

        .order-id {
          font-weight: 600;
          color: var(--dark-color);
        }

        .order-date {
          color: var(--gray-color);
          font-size: 0.9rem;
        }

        .order-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
        }

        .status-icon {
          font-size: 1.2rem;
        }

        .status-icon.accepted {
          color: var(--success-color);
        }

        .status-icon.not-accepted {
          color: var(--danger-color);
        }

        .status-icon.pending {
          color: var(--warning-color);
        }

        .order-items {
          padding: 1rem;
        }

        .order-item {
          display: flex;
          gap: 1rem;
          padding: 0.8rem 0;
          border-bottom: 1px dashed var(--light-gray);
        }

        .order-item:last-child {
          border-bottom: none;
        }

        .item-image-container {
          width: 80px;
          height: 80px;
          flex-shrink: 0;
          border-radius: 4px;
          overflow: hidden;
          background-color: #f9f9f9;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .item-image-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .image-placeholder {
          color: var(--light-gray);
          font-size: 2rem;
        }

        .item-details {
          flex: 1;
        }

        .item-details h3 {
          margin: 0 0 0.5rem 0;
          color: var(--dark-color);
        }

        .item-meta {
          display: flex;
          gap: 1rem;
          color: var(--gray-color);
          font-size: 0.9rem;
        }

        .order-footer {
          padding: 1rem;
          text-align: right;
          border-top: 1px solid var(--light-gray);
        }

        .order-total {
          font-weight: 600;
          color: var(--dark-color);
          font-size: 1.1rem;
        }
      `}</style>
    </div>
  );
};

export default OrdersPage;