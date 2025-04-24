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
import './sellerDashboard.css';

const SellerDashboard = () => {
  const [flowers, setFlowers] = useState([]);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userName = localStorage.getItem('userName') || 'Seller';

  const fetchFlowers = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/flower/my-flowers', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFlowers(response.data.flowers);
    } catch (err) {
      console.error('Failed to fetch flowers:', err);
    }
  }, [token]);

  useEffect(() => {
    fetchFlowers();
  }, [fetchFlowers]);

  const deleteFlower = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/flower/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAlert({ type: 'success', message: 'Flower deleted successfully!' });
      fetchFlowers();
      setTimeout(() => setAlert({ type: '', message: '' }), 3000);
    } catch (err) {
      console.error('Delete error:', err);
      setAlert({ type: 'error', message: 'Failed to delete flower' });
    }
  };

  return (
    <div className="dashboard-container">
<h2 className="section-title">🌼 Hello, {userName}! Welcome back to your dashboard.</h2>

      {alert.message && (
        <div className={`alert ${alert.type === 'success' ? 'alert-success' : 'alert-error'}`}>
          {alert.message}
        </div>
      )}

      <button className="add-flower-btn" onClick={() => navigate('/add-flower')}>
        + Add New Flower
      </button>

      <h3 className="section-title">Your Flowers</h3>
      <div className="flower-list">
        {flowers.length > 0 ? (
          flowers.map((flower) => (
            <div key={flower._id} className="flower-card">
              <img src={flower.image} alt={flower.name} />
              <h3>{flower.name}</h3>
              <p>Color: {flower.color}</p>
              <p>Price: ₹{flower.price}</p>
              <button className="delete-button" onClick={() => deleteFlower(flower._id)}>
                Delete
              </button>
            </div>
          ))
        ) : (
          <p>No flowers added yet.</p>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;
