// import React, { useState, useEffect } from 'react';
// import { useContext } from 'react';
// import { UserContext } from '../UserContext';


// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import './Login.css';

// const Login = () => {
//   const [user, setUser] = useState({ email: '', password: '' });
//   const [error, setError] = useState('');
//   const { setWishlist } = useContext(UserContext);

//   const navigate = useNavigate();

//   useEffect(() => {
//     document.body.classList.add('login-page');
//     return () => {
//       document.body.classList.remove('login-page');
//     };
//   }, []);

//   const handleChange = (e) => {
//     setUser({ ...user, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     try {
//       const res = await axios.post('http://localhost:5000/blossom/login', user);
//       const { token, role ,userId} = res.data;
      
//       localStorage.setItem('token', token);
//       localStorage.setItem('role', role);
//       localStorage.setItem("userId", res.data.userId); // Assuming `response.data.userId` is the userId returned by the API.
//       console.log('📦 Token:', token);
//       console.log('📦 userid:',  userId);
//       localStorage.setItem('userName', res.data.name); // assuming response has user's name
//       setWishlist([]);  // Clear the previous wishlist data (if any)

//       // Fetch the new user's wishlist
//       const wishlistResponse = await axios.get(`http://localhost:5000/api/wishlist/${userId}`);
//       setWishlist(wishlistResponse.data);

//       alert('Login successful');

//       // Redirect based on role
//       if (role === 'seller') {
//         navigate('/seller/dashboard');
//       } else {
        
//         navigate('/shop');
//       }

//     } catch (err) {
//       console.error('Login error:', err.response);
//       setError(err.response?.data?.message || 'Login failed. Try again.');
//     }
//   };

//   return (
//     <div className="login-container">
//       <form onSubmit={handleSubmit} className="login-form">
//         <h2>Login to Blossom</h2>

//         {error && <p className="error-message">{error}</p>}

//         <div className="form-group">
//           <label>Email</label>
//           <input
//             type="email"
//             name="email"
//             onChange={handleChange}
//             placeholder="Enter your email"
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label>Password</label>
//           <input
//             type="password"
//             name="password"
//             onChange={handleChange}
//             placeholder="Enter your password"
//             required
//           />
//         </div>

//         <button type="submit">Login</button>

//         <p className="redirect">
//           Don’t have an account? <a href="/signup">Sign Up</a>
//         </p>
//       </form>
//     </div>
//   );
// };

// export default Login;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      // Replace with your actual API endpoint
      const response = await axios.post('http://localhost:5000/blossom/login', {
        email,
        password
      });

      const { token, role, userId } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('userId', userId);

      if (role === 'seller') {
        navigate('/seller/dashboard');
      } else {
        navigate('/shop');
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Login failed. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.body}>
      {/* Background image with overlay */}
      <div style={styles.backgroundOverlay}></div>
      
      {/* Decorative Background Elements */}
      <div style={styles.circle1}></div>
      <div style={styles.circle2}></div>
      <div style={styles.triangle}></div>

      <div style={styles.loginContainer}>
        <form style={styles.loginForm} onSubmit={handleSubmit}>
          <h2 style={styles.heading}>Login to Blossom</h2>

          {errorMessage && (
            <div style={styles.errorMessage}>
              {errorMessage}
            </div>
          )}

          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              style={styles.input}
            />
          </div>

          <button type="submit" style={styles.button} disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>

          <p style={styles.redirect}>
            Don't have an account? <a href="/signup" style={styles.link}>Sign Up</a>
          </p>
        </form>
      </div>
    </div>
  );
};

// CSS Styles
const styles = {
  body: {
    backgroundImage: 'url("https://static.vecteezy.com/system/resources/thumbnails/056/524/407/small/sun-kissed-purple-lavenders-field-bathed-in-sunlight-capturing-nature-s-splendor-gracefully-photo.jpeg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.3)',
    zIndex: 0,
  },
  loginContainer: {
    width: '100%',
    maxWidth: '450px',
    perspective: '1000px',
    zIndex: 1,
  },
  loginForm: {
    background: 'rgba(255, 255, 255, 0.9)',
    padding: '40px',
    borderRadius: '20px',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)',
    transformStyle: 'preserve-3d',
    transition: 'all 0.5s ease',
    animation: 'fadeIn 0.8s ease-out',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    ':hover': {
      transform: 'translateY(-5px) rotateX(5deg)',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
    },
  },
  '@keyframes fadeIn': {
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
  heading: {
    color: '#6a5acd',
    textAlign: 'center',
    marginBottom: '30px',
    fontSize: '28px',
    fontWeight: '600',
    position: 'relative',
    animation: 'floating 3s ease-in-out infinite',
  },
  '@keyframes floating': {
    '0%': { transform: 'translateY(0px)' },
    '50%': { transform: 'translateY(-10px)' },
    '100%': { transform: 'translateY(0px)' },
  },
  'heading::after': {
    content: '""',
    position: 'absolute',
    bottom: '-10px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '50px',
    height: '3px',
    background: 'linear-gradient(90deg, #6a5acd, #9370db)',
    borderRadius: '3px',
    animation: 'underlineGrow 0.8s ease-out',
  },
  '@keyframes underlineGrow': {
    from: { width: '0' },
    to: { width: '50px' },
  },
  formGroup: {
    marginBottom: '25px',
    position: 'relative',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    color: '#555',
    fontWeight: '500',
    fontSize: '14px',
    transition: 'all 0.3s ease',
  },
  input: {
    width: '100%',
    padding: '15px',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    background: 'rgba(255, 255, 255, 0.8)',
    ':focus': {
      borderColor: '#9370db',
      outline: 'none',
      boxShadow: '0 0 0 3px rgba(147, 112, 219, 0.2)',
      transform: 'scale(1.02)',
    },
  },
  button: {
    width: '100%',
    padding: '15px',
    background: 'linear-gradient(45deg, #6a5acd, #9370db)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '10px',
    boxShadow: '0 4px 15px rgba(106, 90, 205, 0.4)',
    ':hover': {
      background: 'linear-gradient(45deg, #9370db, #6a5acd)',
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(106, 90, 205, 0.6)',
    },
    ':active': {
      transform: 'translateY(0)',
    },
    ':disabled': {
      opacity: '0.7',
      cursor: 'not-allowed',
    },
  },
  errorMessage: {
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: '20px',
    padding: '10px',
    background: 'rgba(231, 76, 60, 0.1)',
    borderRadius: '8px',
    animation: 'shake 0.5s ease',
  },
  '@keyframes shake': {
    '0%, 100%': { transform: 'translateX(0)' },
    '20%, 60%': { transform: 'translateX(-5px)' },
    '40%, 80%': { transform: 'translateX(5px)' },
  },
  redirect: {
    textAlign: 'center',
    marginTop: '20px',
    color: '#777',
    fontSize: '14px',
  },
  link: {
    color: '#6a5acd',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    position: 'relative',
    ':hover': {
      '::after': {
        width: '100%',
      },
    },
    '::after': {
      content: '""',
      position: 'absolute',
      bottom: '-2px',
      left: '0',
      width: '0',
      height: '2px',
      background: '#9370db',
      transition: 'width 0.3s ease',
    },
  },
  // Decorative elements
  circle1: {
    position: 'absolute',
    pointerEvents: 'none',
    zIndex: '1',
    width: '150px',
    height: '150px',
    background: 'rgba(106, 90, 205, 0.1)',
    borderRadius: '50%',
    top: '10%',
    left: '10%',
    animation: 'floating 6s ease-in-out infinite',
  },
  circle2: {
    position: 'absolute',
    pointerEvents: 'none',
    zIndex: '1',
    width: '200px',
    height: '200px',
    background: 'rgba(147, 112, 219, 0.1)',
    borderRadius: '50%',
    bottom: '10%',
    right: '10%',
    animation: 'floating 7s ease-in-out infinite 1s',
  },
  triangle: {
    position: 'absolute',
    pointerEvents: 'none',
    zIndex: '1',
    width: '0',
    height: '0',
    borderLeft: '80px solid transparent',
    borderRight: '80px solid transparent',
    borderBottom: '140px solid rgba(106, 90, 205, 0.1)',
    top: '50%',
    left: '5%',
    transform: 'rotate(45deg)',
    animation: 'floating 8s ease-in-out infinite 0.5s',
  },
  // Responsive styles
  '@media (max-width: 500px)': {
    loginForm: {
      padding: '30px 20px',
    },
    heading: {
      fontSize: '24px',
    },
    input: {
      padding: '12px',
    },
    button: {
      padding: '12px',
    },
  },
};

export default LoginPage;