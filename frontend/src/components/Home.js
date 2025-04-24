/* import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="home-container">
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="logo">Blossom</div>
        <button className="mobile-menu-button" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/shop" className="nav-link">Shop</Link>
          <Link to="/search" className="nav-link">Search</Link>
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/signup" className="nav-link">Signup</Link>
          <Link to="/about" className="nav-link">About</Link>
        </div>
      </nav>

      <main className="main-content">
        <section className="welcome-section">
          <div className="welcome-text">
            <h2>Welcome to Blossom</h2>
            <p>Your gateway to discovering and purchasing the rarest and most beautiful flowers. Explore a world of nature’s finest blooms with ease.</p>
          </div>
        </section>

        <section className="features-section">
          <h2>Why Choose Blossom?</h2>
          <div className="features-cards">
            <div className="feature-card">
              <h3>Rare & Exotic Flowers</h3>
              <p>Find the rarest flowers sourced from trusted nurseries worldwide.</p>
            </div>
            <div className="feature-card">
              <h3>AI-Powered Image Search</h3>
              <p>Upload an image to identify flowers instantly and get purchase options.</p>
            </div>
            <div className="feature-card">
              <h3>Localized Search Support</h3>
              <p>Search for flowers in your local language for a seamless experience.</p>
            </div>
            <div className="feature-card">
              <h3>Interactive Shopping Experience</h3>
              <p>Enjoy a visually appealing and user-friendly flower shopping journey.</p>
            </div>
          </div>
        </section>

        <section className="benefits-section">
          <h2>How Blossom Benefits You</h2>
          <ul className="benefits-list">
            <li>Discover rare and exotic flowers with ease.</li>
            <li>Use AI-powered image search for accurate flower identification.</li>
            <li>Support local and global nurseries in one place.</li>
            <li>Access personalized flower recommendations.</li>
            <li>Enjoy a secure and smooth shopping experience.</li>
          </ul>
        </section>
      </main>

      <footer className="footer">
        <h2>Contact Us</h2>
        <p>For inquiries and support, reach us at <a href="mailto:support@blossom.com">support@blossom.com</a>.</p>
        <p>Follow us on:</p>
        <div className="social-links">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
        </div>
      </footer>
    </div>
  );
};

export default Home;
 */

import React, { useEffect, useState } from 'react';
import { FaSpa, FaSeedling, FaRobot, FaGlobe, FaHeart, FaFacebookF, FaTwitter, FaInstagram, FaPinterest } from 'react-icons/fa';

const BlossomFlowers = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="app">
      <style>{`
        /* Base Styles */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Poppins', sans-serif;
        }

        :root {
          --primary: #8e44ad;
          --secondary: #9b59b6;
          --accent: #e84393;
          --light: #f5f5f5;
          --dark: #2c3e50;
          --success: #2ecc71;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }

        body {
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          color: var(--dark);
          overflow-x: hidden;
        }

        /* Navbar Styles */
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          padding: 20px 5%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 1000;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.9);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .navbar.scrolled {
          padding: 15px 5%;
          background: rgba(255, 255, 255, 0.98);
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
        }

        .logo {
          font-size: 28px;
          font-weight: 700;
          color: var(--primary);
          display: flex;
          align-items: center;
        }

        .logo i {
          margin-right: 10px;
          color: var(--accent);
        }

        .nav-links {
          display: flex;
          gap: 30px;
        }

        .nav-link {
          text-decoration: none;
          color: var(--dark);
          font-weight: 500;
          position: relative;
          transition: all 0.3s ease;
        }

        .nav-link:hover {
          color: var(--primary);
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--primary);
          transition: width 0.3s ease;
        }

        .nav-link:hover::after {
          width: 100%;
        }

        .mobile-menu-button {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          flex-direction: column;
          justify-content: space-between;
          height: 24px;
          width: 30px;
          z-index: 1001;
        }

        .mobile-menu-button span {
          display: block;
          width: 100%;
          height: 3px;
          background: var(--primary);
          border-radius: 3px;
          transition: all 0.3s ease;
        }

        /* Hero Section */
        .welcome-section {
          height: 100vh;
          display: flex;
          align-items: center;
          padding: 0 10%;
          position: relative;
          overflow: hidden;
          margin-top: 80px;
        }

        .welcome-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: url('https://images.unsplash.com/photo-1526397751294-331021109fbd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80') center/cover no-repeat;
          opacity: 0.3;
          z-index: -1;
        }

        .welcome-text {
          max-width: 600px;
          animation: fadeIn 1s ease forwards;
        }

        .welcome-text h2 {
          font-size: 48px;
          margin-bottom: 20px;
          color: var(--primary);
          line-height: 1.2;
        }

        .welcome-text p {
          font-size: 18px;
          margin-bottom: 30px;
          line-height: 1.6;
        }

        .cta-button {
          display: inline-block;
          padding: 12px 30px;
          background: var(--primary);
          color: white;
          border-radius: 30px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
          border: 2px solid var(--primary);
          animation: pulse 2s infinite;
        }

        .cta-button:hover {
          background: transparent;
          color: var(--primary);
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }

        .floating-flowers {
          position: absolute;
          right: 10%;
          top: 50%;
          transform: translateY(-50%);
          width: 400px;
          height: 400px;
          animation: float 6s ease-in-out infinite;
        }

        /* Features Section */
        .features-section {
          padding: 100px 10%;
          text-align: center;
          background: white;
        }

        .features-section h2 {
          font-size: 36px;
          margin-bottom: 60px;
          color: var(--primary);
          position: relative;
          display: inline-block;
        }

        .features-section h2::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 3px;
          background: var(--accent);
        }

        .features-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 30px;
          margin-top: 50px;
        }

        .feature-card {
          background: white;
          padding: 40px 30px;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          z-index: 1;
        }

        .feature-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
        }

        .feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 5px;
          background: linear-gradient(90deg, var(--primary), var(--accent));
        }

        .feature-card i {
          font-size: 50px;
          margin-bottom: 20px;
          color: var(--primary);
          background: linear-gradient(135deg, var(--primary), var(--accent));
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .feature-card h3 {
          font-size: 22px;
          margin-bottom: 15px;
          color: var(--dark);
        }

        .feature-card p {
          color: #666;
          line-height: 1.6;
        }

        /* Benefits Section */
        .benefits-section {
          padding: 100px 10%;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          text-align: center;
        }

        .benefits-section h2 {
          font-size: 36px;
          margin-bottom: 60px;
          color: var(--primary);
          position: relative;
          display: inline-block;
        }

        .benefits-section h2::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 3px;
          background: var(--accent);
        }

        .benefits-list {
          max-width: 800px;
          margin: 0 auto;
          text-align: left;
          list-style-type: none;
        }

        .benefits-list li {
          padding: 15px 20px;
          margin-bottom: 15px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
          position: relative;
          padding-left: 60px;
          transition: all 0.3s ease;
        }

        .benefits-list li:hover {
          transform: translateX(10px);
        }

        .benefits-list li::before {
          content: '✓';
          position: absolute;
          left: 20px;
          top: 50%;
          transform: translateY(-50%);
          width: 30px;
          height: 30px;
          background: var(--success);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Footer */
        .footer {
          background: var(--dark);
          color: white;
          padding: 80px 10% 30px;
          text-align: center;
        }

        .footer h2 {
          font-size: 28px;
          margin-bottom: 30px;
          color: white;
        }

        .footer p {
          margin-bottom: 20px;
          opacity: 0.8;
        }

        .social-links {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin: 30px 0;
        }

        .social-link {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .social-link:hover {
          background: var(--primary);
          transform: translateY(-5px);
        }

        .copyright {
          margin-top: 50px;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          opacity: 0.6;
          font-size: 14px;
        }

        /* Responsive Styles */
        @media (max-width: 992px) {
          .floating-flowers {
            display: none;
          }
          
          .welcome-text {
            max-width: 100%;
            text-align: center;
          }
        }

        @media (max-width: 768px) {
          .nav-links {
            position: fixed;
            top: 0;
            right: -100%;
            width: 80%;
            height: 100vh;
            background: white;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 40px;
            transition: all 0.5s ease;
            box-shadow: -5px 0 20px rgba(0, 0, 0, 0.1);
          }

          .nav-links.active {
            right: 0;
          }

          .mobile-menu-button {
            display: flex;
          }

          .mobile-menu-button.active span:nth-child(1) {
            transform: translateY(8px) rotate(45deg);
          }

          .mobile-menu-button.active span:nth-child(2) {
            opacity: 0;
          }

          .mobile-menu-button.active span:nth-child(3) {
            transform: translateY(-8px) rotate(-45deg);
          }

          .welcome-text h2 {
            font-size: 36px;
          }

          .welcome-text p {
            font-size: 16px;
          }
        }

        @media (max-width: 576px) {
          .welcome-text h2 {
            font-size: 28px;
          }
          
          .features-section h2,
          .benefits-section h2 {
            font-size: 28px;
          }
        }
      `}</style>

      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="logo">
          <FaSpa />
          Blossom
        </div>
        <button 
          className={`mobile-menu-button ${isMenuOpen ? 'active' : ''}`} 
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <a href="/" className="nav-link">Home</a>
          <a href="/login" className="nav-link">Login</a>
          <a href="/signup" className="nav-link">Signup</a>
          <a href="/about" className="nav-link">About</a>
        </div>
      </nav>

      <main className="main-content">
        <section className="welcome-section">
          <div className="welcome-text">
            <h2>Discover Nature's Masterpieces</h2>
            <p>Blossom brings you the world's most exquisite flowers, handpicked from the finest gardens across the globe. Experience the beauty of nature delivered to your doorstep.</p>
            <a href="/signup" className="cta-button">Start Exploring</a>
          </div>
          
        </section>

        <section className="features-section">
          <h2>Why Choose Blossom?</h2>
          <div className="features-cards">
            <div className="feature-card">
              <FaSeedling />
              <h3>Rare & Exotic</h3>
              <p>Discover flowers you won't find anywhere else, sourced from the most exclusive gardens worldwide.</p>
            </div>
            <div className="feature-card">
              <FaRobot />
              <h3>AI Identification</h3>
              <p>Our advanced AI can identify any flower from just a photo and tell you all about it.</p>
            </div>
            <div className="feature-card">
              <FaGlobe />
              <h3>Global Network</h3>
              <p>We work with florists and growers across 6 continents to bring you the freshest blooms.</p>
            </div>
            <div className="feature-card">
              <FaHeart />
              <h3>Curated Collections</h3>
              <p>Beautiful arrangements designed by our expert florists for every occasion.</p>
            </div>
          </div>
        </section>

        <section className="benefits-section">
          <h2>Experience the Blossom Difference</h2>
          <ul className="benefits-list">
            <li>Same-day delivery in major cities worldwide</li>
            <li>Ethically sourced flowers with sustainable practices</li>
            <li>Expert floral advice from our master florists</li>
            <li>Custom arrangements for weddings and events</li>
            <li>Subscription service for regular flower deliveries</li>
            <li>VIP access to limited edition floral collections</li>
          </ul>
        </section>
      </main>

      <footer className="footer">
        <h2>Let's Stay Connected</h2>
        <p>Have questions or need assistance? Our floral experts are here to help.</p>
        <p>Email us at <a href="mailto:hello@blossom.com" style={{ color: 'var(--accent)' }}>hello@blossom.com</a></p>
        <div className="social-links">
          <a href="#" className="social-link"><FaFacebookF /></a>
          <a href="#" className="social-link"><FaTwitter /></a>
          <a href="#" className="social-link"><FaInstagram /></a>
          <a href="#" className="social-link"><FaPinterest /></a>
        </div>
        <p className="copyright">© 2023 Blossom Floral Designs. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default BlossomFlowers;