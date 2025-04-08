import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [user, setUser] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('login-page');
    return () => {
      document.body.classList.remove('login-page');
    };
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/blossom/login', user);
      const { token, role } = res.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      console.log('📦 Token:', token);
      alert('Login successful');

      // Redirect based on role
      if (role === 'seller') {
        navigate('/seller/dashboard');
      } else {
        navigate('/shop');
      }

    } catch (err) {
      console.error('Login error:', err.response);
      setError(err.response?.data?.message || 'Login failed. Try again.');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login to Blossom</h2>

        {error && <p className="error-message">{error}</p>}

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
        </div>

        <button type="submit">Login</button>

        <p className="redirect">
          Don’t have an account? <a href="/signup">Sign Up</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
