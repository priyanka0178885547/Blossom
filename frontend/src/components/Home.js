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
