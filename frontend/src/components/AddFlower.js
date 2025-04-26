import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiUpload, FiPlusCircle, FiArrowLeft, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import './AddFlower.css'; // Create this new CSS file

const AddFlowerPage = () => {
  const [formData, setFormData] = useState({ name: '', color: '', price: '', image: null });
  const [preview, setPreview] = useState(null);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, image: file }));
    
    // Create preview
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('color', formData.color);
    data.append('price', formData.price);
    data.append('image', formData.image);

    try {
      await axios.post('http://localhost:5000/api/flower/add', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setAlert({ type: 'success', message: 'Flower added successfully!' });
      setTimeout(() => {
        navigate('/seller/dashboard');
      }, 1500);
    } catch (err) {
      console.error('Add flower error:', err);
      setAlert({ type: 'error', message: err.response?.data?.message || 'Failed to add flower' });
    }
  };

  return (
    <div className="add-flower-container">
      <button className="back-button" onClick={() => navigate('/seller/dashboard')}>
        <FiArrowLeft size={20} /> Back to Dashboard
      </button>
      
      <div className="form-card">
        <div className="form-header">
          <FiPlusCircle size={28} className="form-icon" />
          <h2>Add New Flower</h2>
        </div>

        {alert.message && (
          <div className={`alert ${alert.type}`}>
            {alert.type === 'success' ? (
              <FiCheckCircle size={18} />
            ) : (
              <FiAlertCircle size={18} />
            )}
            <span>{alert.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="add-flower-form">
          <div className="form-group">
            <label htmlFor="name">Flower Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="e.g., Rose, Tulip, Lily"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="color">Color</label>
            <input
              type="text"
              id="color"
              name="color"
              placeholder="e.g., Red, Yellow, Pink"
              value={formData.color}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Price (₹)</label>
            <input
              type="number"
              id="price"
              name="price"
              placeholder="e.g., 199, 299"
              value={formData.price}
              onChange={handleChange}
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="image" className="file-upload-label">
              {preview ? (
                <div className="image-preview">
                  <img src={preview} alt="Preview" />
                  <span>Change Image</span>
                </div>
              ) : (
                <>
                  <FiUpload size={20} />
                  <span>Upload Flower Image</span>
                </>
              )}
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleFileChange}
                required
                className="file-input"
              />
            </label>
          </div>

          <button type="submit" className="submit-button">
            Add Flower  
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddFlowerPage;