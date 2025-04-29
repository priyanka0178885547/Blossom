import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FiSave, FiX, FiImage, FiDollarSign, FiTag, FiLoader ,FiCheckCircle , FiAlertCircle} from 'react-icons/fi';
import styles from './Editflower.module.css';

const EditFlower = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  
  const [flower, setFlower] = useState({
    name: '',
    color: '',
    price: '',
    image: ''
  });
  const [previewImage, setPreviewImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  // Fetch flower data
  useEffect(() => {
    const fetchFlower = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/flower/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!response.data.flower) {
          throw new Error('Flower not found');
        }

        setFlower(response.data.flower);
        setPreviewImage(response.data.flower.image);
        setAlert({ show: false, type: '', message: '' });
      } catch (err) {
        console.error('Failed to fetch flower:', err);
        showAlert('error', err.response?.data?.message || 'Failed to load flower details');
        setTimeout(() => navigate('/seller/dashboard'), 2000);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFlower();
  }, [id, token, navigate]);

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 5000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFlower(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate image file
      if (!file.type.match('image.*')) {
        showAlert('error', 'Please select an image file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showAlert('error', 'Image size should be less than 5MB');
        return;
      }

      setFlower(prev => ({ ...prev, image: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    if (!flower.name.trim()) {
      showAlert('error', 'Flower name is required');
      return false;
    }
    if (!flower.color.trim()) {
      showAlert('error', 'Color is required');
      return false;
    }
    if (!flower.price || isNaN(flower.price) || parseFloat(flower.price) <= 0) {
      showAlert('error', 'Please enter a valid price');
      return false;
    }
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      setSubmitting(true);
      
      const formData = new FormData();
      formData.append('name', flower.name);
      formData.append('color', flower.color);
      formData.append('price', flower.price);
      
      if (flower.image instanceof File) {
        formData.append('image', flower.image);
      }

      const response = await axios.put(
        `http://localhost:5000/api/flower/update/${id}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      showAlert('success', 'Flower updated successfully!');
      setTimeout(() => navigate('/seller/dashboard'), 1500);
    } catch (err) {
      console.error('Update error:', err);
      showAlert('error', err.response?.data?.message || 'Failed to update flower');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading flower details...</p>
      </div>
    );
  }

  return (
    <div className={styles.editContainer}>
      <div className={styles.editHeader}>
        <h1>Edit Flower</h1>
        <button 
          className={styles.closeBtn} 
          onClick={() => navigate('/seller-dashboard')}
          disabled={submitting}
        >
          <FiX size={24} />
        </button>
      </div>

      {alert.show && (
        <div className={`${styles.alert} ${styles[alert.type]}`}>
          {alert.type === 'success' ? (
            <FiCheckCircle className={styles.alertIcon} />
          ) : (
            <FiAlertCircle className={styles.alertIcon} />
          )}
          <span>{alert.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.editForm}>
        <div className={styles.formGroup}>
          <label htmlFor="image" className={styles.imageUpload}>
            {previewImage ? (
              <>
                <img 
                  src={previewImage} 
                  alt="Preview" 
                  className={styles.imagePreview} 
                />
                <div className={styles.imageOverlay}>
                  <FiImage size={24} />
                  <span>Change Image</span>
                </div>
              </>
            ) : (
              <div className={styles.imagePlaceholder}>
                <FiImage size={48} />
                <span>Click to upload image</span>
              </div>
            )}
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className={styles.hiddenInput}
              disabled={submitting}
            />
          </label>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="name">Flower Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={flower.name}
            onChange={handleChange}
            required
            disabled={submitting}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="color">Color</label>
          <input
            type="text"
            id="color"
            name="color"
            value={flower.color}
            onChange={handleChange}
            required
            disabled={submitting}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="price">Price (₹)</label>
          <div className={styles.priceInput}>
            <FiDollarSign className={styles.priceIcon} />
            <input
              type="number"
              id="price"
              name="price"
              value={flower.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
              disabled={submitting}
            />
          </div>
        </div>

        <div className={styles.formActions}>
          <button 
            type="button" 
            className={styles.cancelBtn} 
            onClick={() => navigate('/seller-dashboard')}
            disabled={submitting}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className={styles.saveBtn}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <FiLoader className={styles.spinner} />
                Saving...
              </>
            ) : (
              <>
                <FiSave className={styles.saveIcon} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditFlower;