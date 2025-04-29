import React, { useState, useEffect } from 'react';
import { 
  FaSpa, FaSeedling, FaRobot, FaGlobe, FaHeart, 
  FaFacebookF, FaInstagram, FaPinterestP, FaTwitter,
  FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock 
} from 'react-icons/fa';

const BlossomFlowers = () => {
  return (
    <div className="blossom-app">
      <Header />
      <main>
        <Hero />
        <Features />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

const Header = () => {
  const [menuActive, setMenuActive] = useState(false);

  useEffect(() => {
    const header = document.getElementById('header');
    const handleScroll = () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  return (
    <header id="header">
      <div className="logo">
        <FaSpa className="logo-icon" />
        Blossom
      </div>
      <button 
        className={`mobile-menu-btn ${menuActive ? 'active' : ''}`} 
        onClick={toggleMenu}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      <nav className={`nav-link1s ${menuActive ? 'active' : ''}`}>
        <a href="#" className="nav-link1">Home</a>
        <a href="login" className="nav-link1">Login</a>
        <a href="signup" className="nav-link1">Signup</a>
        <a href="about" className="nav-link1">About</a>
        <a href="#" className="nav-link1">Contact</a>
      </nav>
    </header>
  );
};

const Hero = () => {
  return (
    <section className="hero">
  <div className="hero-container">
    <div className="hero-content">
      <h1>Discover Nature's Most Beautiful Creations</h1>
      <p>Blossom brings you the world's most exquisite flowers, handpicked from the finest nurseries across India. Experience the beauty of flowers delivered to your doorstep.</p>
      <div className="hero-btns">
        <a href="signup" className="btn btn-primary">Get Started</a>
        <a href="about" className="btn btn-outline">Learn More</a>
      </div>
    </div>
    <div className="hero-image">
      <img src="https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcT5zYayOPglolhbE0gyzvPOI2VK62DFDWkapCsL2hnxjRoifjxn" alt="Beautiful flowers" />
    </div>
  </div>
  <div className="hero-decor decor-1"></div>
  <div className="hero-decor decor-2"></div>
</section>
  );
};

const Features = () => {
  useEffect(() => {
    const animateOnScroll = () => {
      const elements = document.querySelectorAll('.feature-card, .section-title');
      
      elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.2;
        
        if (elementPosition < screenPosition) {
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
        }
      });
    };

    document.querySelectorAll('.feature-card').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'all 0.6s ease';
    });

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();

    return () => {
      window.removeEventListener('scroll', animateOnScroll);
    };
  }, []);

  return (
   <section className="features">
  <h2 className="section-title">Why Choose Blossom</h2>
  <div className="features-grid">
    <div className="feature-card">
      <div className="feature-icon">
        <FaSeedling />
      </div>
      <h3>Rare Flowers</h3>
      <p>Find beautiful and rare flowers not available in regular stores.</p>
    </div>
    <div className="feature-card">
      <div className="feature-icon">
        <FaGlobe />
      </div>
      <h3>Local Language Search</h3>
      <p>Search for flowers in your own language with ease.</p>
    </div>
    <div className="feature-card">
      <div className="feature-icon">
        <FaRobot />
      </div>
      <h3>AI Chat Support</h3>
      <p>Get help anytime with our AI-powered chatbot assistant.</p>
    </div>
    <div className="feature-card">
      <div className="feature-icon">
        <FaHeart />
      </div>
      <h3>Easy to Use</h3>
      <p>Simple design for smooth shopping and browsing experience.</p>
    </div>
  </div>
</section>

  );
};

const Newsletter = () => {

};

const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-column">
          <h3>Blossom</h3>
          <p> Bringing nature's beauty into your home with the finest flower plants from across India..</p>
          <div className="social-links">
            <a href="#" className="social-link"><FaFacebookF /></a>
            <a href="#" className="social-link"><FaInstagram /></a>
            <a href="#" className="social-link"><FaPinterestP /></a>
            <a href="#" className="social-link"><FaTwitter /></a>
          </div>
        </div>
        <div className="footer-column">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li className="footer-link"><a href="#">Home</a></li>
            <li className="footer-link"><a href="#">Login</a></li>
            <li className="footer-link"><a href="#">Signup</a></li>
            <li className="footer-link"><a href="#">About Us</a></li>
            <li className="footer-link"><a href="#">Contact</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>Customer Service</h3>
          <ul className="footer-links">
            <li className="footer-link"><a href="#">Shipping Policy</a></li>
            <li className="footer-link"><a href="#">Returns & Exchanges</a></li>
            <li className="footer-link"><a href="#">FAQ</a></li>
            <li className="footer-link"><a href="#">Care Guide</a></li>
            <li className="footer-link"><a href="#">Privacy Policy</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>Contact Us</h3>
          <ul className="footer-links">
            <li className="footer-link"><a href="#"><FaMapMarkerAlt /> Gandipet, Hyderabad</a></li>
            <li className="footer-link"><a href="#"><FaPhone /> 9505532313</a></li>
            <li className="footer-link"><a href="#"><FaEnvelope /> blossomhyderabad@gmail.com</a></li>
            <li className="footer-link"><a href="#"><FaClock /> Mon-Fri: 9am-6pm</a></li>
          </ul>
        </div>
      </div>
      <div className="copyright">
        <p>&copy; 2023 Blossom Floral Designs. All rights reserved.</p>
      </div>
    </footer>
  );
};

const styles = `
/* Base Styles */
.blossom-app * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.blossom-app body {
    font-family: 'Poppins', sans-serif;
    color: #333;
    overflow-x: hidden;
}

.blossom-app h1, 
.blossom-app h2, 
.blossom-app h3, 
.blossom-app h4 {
    font-family: 'Playfair Display', serif;
    font-weight: 600;
}

.blossom-app a {
    text-decoration: none;
    color: inherit;
}

/* Color Variables */
:root {
    --primary: #8e44ad;
    --primary-light: #9b59b6;
    --secondary1: #e84393;
    --accent: #2ecc71;
    --light: #f5f5f5;
    --dark: #2c3e50;
    --text: #333;
    --text-light: #777;
}

/* Animations */
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

@keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-15px); }
    100% { transform: translateY(0px); }
}

@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
}

@keyframes slideInLeft {
    from { transform: translateX(-100px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

@keyframes leafWobble {
    0%, 100% { transform: rotate(-5deg); }
    50% { transform: rotate(5deg); }
}

/* Button Styles */
.blossom-app .btn {
    display: inline-block;
    padding: 12px 30px;
    border-radius: 50px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    z-index: 1;
}

.blossom-app .btn-primary {
    background: linear-gradient(45deg, var(--primary), var(--primary-light));
    color: white;
    border: none;
    box-shadow: 0 5px 15px rgba(142, 68, 173, 0.4);
}

.blossom-app .btn-primary:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(142, 68, 173, 0.6);
}

.blossom-app .btn-outline {
    background: transparent;
    color: var(--primary);
    border: 2px solid var(--primary);
}

.blossom-app .btn-outline:hover {
    background: var(--primary);
    color: white;
}

/* Header Styles */
.blossom-app header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    padding: 20px 5%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 1000;
    transition: all 0.4s ease;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.blossom-app header.scrolled {
    padding: 15px 5%;
    background: rgba(255, 255, 255, 0.98);
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.blossom-app .logo {
    font-size: 28px;
    font-weight: 700;
    color: var(--primary);
    display: flex;
    align-items: center;
    animation: slideInLeft 0.8s ease-out;
}

.blossom-app .logo-icon {
    margin-right: 10px;
    color: var(--secondary1);
    font-size: 32px;
}

.blossom-app .nav-link1s {
    display: flex;
    gap: 30px;
}

.blossom-app .nav-link1 {
    position: relative;
    font-weight: 500;
    color: var(--text);
    transition: all 0.3s ease;
}

.blossom-app .nav-link1:hover {
    color: var(--primary);
}

.blossom-app .nav-link1::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 2px;
    background: var(--primary);
    transition: width 0.3s ease;
}

.blossom-app .nav-link1:hover::after {
    width: 100%;
}

.blossom-app .mobile-menu-btn {
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

.blossom-app .mobile-menu-btn span {
    display: block;
    width: 100%;
    height: 3px;
    background: var(--primary);
    border-radius: 3px;
    transition: all 0.3s ease;
}

/* Hero Section - Redesigned */
.blossom-app .hero {
    height: 100vh;
    display: flex;
    align-items: center;
    padding: 0 5%;
    position: relative;
    overflow: hidden;
    margin-top: 80px;
    background: #f9f9f9;
}

.blossom-app .hero-container {
    display: flex;
    align-items: center;
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
    gap: 50px;
}

.blossom-app .hero-content {
    flex: 1;
    animation: fadeIn 1s ease forwards;
    padding: 40px;
    background: white;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
    position: relative;
    z-index: 2;
}

.blossom-app .hero-image {
    flex: 1;
    height: 80vh;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
    animation: fadeIn 1s ease forwards 0.3s;
    position: relative;
}

.blossom-app .hero-image img {
    width: 100%;
    height: 100%;
    object-fit: full;
    transition: transform 0.5s ease;
}

.blossom-app .hero-image:hover img {
    transform: scale(1.05);
}

.blossom-app .hero-image::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, rgba(142, 68, 173, 0.1), rgba(232, 67, 147, 0.1));
}

.blossom-app .hero h1 {
    font-size: 48px;
    margin-bottom: 20px;
    color: var(--primary);
    line-height: 1.2;
    background: linear-gradient(45deg, var(--primary), var(--secondary1));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
}

.blossom-app .hero p {
    font-size: 18px;
    margin-bottom: 30px;
    line-height: 1.6;
    color: var(--text-light);
}

.blossom-app .hero-btns {
    display: flex;
    gap: 20px;
}

/* Floating decorative elements */
.blossom-app .hero-decor {
    position: absolute;
    z-index: -1;
    opacity: 0.3;
}

.blossom-app .decor-1 {
    top: 10%;
    left: 5%;
    width: 100px;
    height: 100px;
    background: url('https://www.freepnglogos.com/uploads/flower-png/flower-png-romantic-rose-transparent-png-stickpng-0.png') center/contain no-repeat;
    animation: float 6s ease-in-out infinite;
}

.blossom-app .decor-2 {
    bottom: 10%;
    right: 5%;
    width: 80px;
    height: 80px;
    background: url('https://www.freepnglogos.com/uploads/flower-png/flower-png-romantic-rose-transparent-png-stickpng-0.png') center/contain no-repeat;
    animation: float 8s ease-in-out infinite reverse;
}

/* Responsive adjustments */
@media (max-width: 992px) {
    .blossom-app .hero-container {
        flex-direction: column;
        gap: 30px;
    }
    
    .blossom-app .hero-content,
    .blossom-app .hero-image {
        flex: none;
        width: 100%;
    }
    
    .blossom-app .hero-image {
        height: 400px;
        order: -1;
    }
    
    .blossom-app .hero h1 {
        font-size: 36px;
    }
}

@media (max-width: 576px) {
    .blossom-app .hero {
        height: auto;
        padding: 80px 5% 50px;
    }
    
    .blossom-app .hero-content {
        padding: 30px;
    }
    
    .blossom-app .hero h1 {
        font-size: 28px;
    }
    
    .blossom-app .hero-btns {
        flex-direction: column;
    }
}

/* Features Section */
.blossom-app .features {
    padding: 100px 10%;
    text-align: center;
    background: white;
}

.blossom-app .section-title {
    font-size: 36px;
    margin-bottom: 60px;
    color: var(--primary);
    position: relative;
    display: inline-block;
}

.blossom-app .section-title::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background: var(--secondary1);
}

.blossom-app .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 30px;
    margin-top: 50px;
}

.blossom-app .feature-card {
    background: white;
    padding: 40px 30px;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
    transition: all 0.4s ease;
    position: relative;
    overflow: hidden;
    z-index: 1;
}

.blossom-app .feature-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

.blossom-app .feature-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 5px;
    background: linear-gradient(90deg, var(--primary), var(--secondary1));
}

.blossom-app .feature-icon {
    font-size: 50px;
    margin-bottom: 20px;
    color: var(--primary);
    background: linear-gradient(135deg, var(--primary), var(--secondary1));
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    transition: all 0.3s ease;
}

.blossom-app .feature-card:hover .feature-icon {
    transform: scale(1.2);
}

.blossom-app .feature-card h3 {
    font-size: 22px;
    margin-bottom: 15px;
    color: var(--dark);
}

.blossom-app .feature-card p {
    color: var(--text-light);
    line-height: 1.6;
}

/* Newsletter */
.blossom-app .newsletter {
    padding: 80px 10%;
    background: linear-gradient(135deg, var(--primary), var(--primary-light));
    color: white;
    text-align: center;
}

.blossom-app .newsletter h2 {
    margin-bottom: 20px;
}

.blossom-app .newsletter p {
    max-width: 600px;
    margin: 0 auto 30px;
    opacity: 0.9;
}

.blossom-app .newsletter-form {
    display: flex;
    max-width: 500px;
    margin: 0 auto;
}

.blossom-app .newsletter-input {
    flex: 1;
    padding: 15px 20px;
    border: none;
    border-radius: 50px 0 0 50px;
    font-family: 'Poppins', sans-serif;
    outline: none;
}

.blossom-app .newsletter-btn {
    padding: 15px 30px;
    background: var(--secondary1);
    color: white;
    border: none;
    border-radius: 0 50px 50px 0;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.blossom-app .newsletter-btn:hover {
    background: #d6337a;
}

/* Footer */
.blossom-app footer {
    background: var(--dark);
    color: white;
    padding: 80px 10% 30px;
}

.blossom-app .footer-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 40px;
    margin-bottom: 50px;
}

.blossom-app .footer-column h3 {
    font-size: 18px;
    margin-bottom: 20px;
    position: relative;
    padding-bottom: 10px;
}

.blossom-app .footer-column h3::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 40px;
    height: 2px;
    background: var(--secondary1);
}

.blossom-app .footer-links {
    list-style: none;
}

.blossom-app .footer-link {
    margin-bottom: 10px;
    transition: all 0.3s ease;
}

.blossom-app .footer-link a {
    color: rgba(255, 255, 255, 0.7);
    transition: all 0.3s ease;
}

.blossom-app .footer-link a:hover {
    color: white;
    padding-left: 5px;
}

.blossom-app .social-links {
    display: flex;
    gap: 15px;
    margin-top: 20px;
}

.blossom-app .social-link {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    transition: all 0.3s ease;
}

.blossom-app .social-link:hover {
    background: var(--secondary1);
    transform: translateY(-3px);
}

.blossom-app .copyright {
    text-align: center;
    padding-top: 30px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.6);
    font-size: 14px;
}

/* Floating Elements */
.blossom-app .floating-leaf {
    position: absolute;
    width: 50px;
    height: 50px;
    background: url('https://www.transparentpng.com/thumb/leaf/leaf-png-clipart-14.png') center/contain no-repeat;
    opacity: 0.7;
    z-index: -1;
    animation: float 8s ease-in-out infinite, leafWobble 5s ease-in-out infinite;
}

.blossom-app .leaf-1 {
    top: 20%;
    left: 5%;
    animation-delay: 0s;
}

.blossom-app .leaf-2 {
    top: 60%;
    left: 10%;
    animation-delay: 1s;
    transform: rotate(120deg);
}

.blossom-app .leaf-3 {
    top: 30%;
    right: 8%;
    animation-delay: 2s;
    transform: rotate(60deg);
}

.blossom-app .leaf-4 {
    bottom: 20%;
    right: 5%;
    animation-delay: 3s;
    transform: rotate(180deg);
}

/* Responsive Styles */
@media (max-width: 992px) {
    .blossom-app .floating-flower {
        display: none;
    }
    
    .blossom-app .hero-content {
        max-width: 100%;
        text-align: center;
    }

    .blossom-app .hero-btns {
        justify-content: center;
    }
}

@media (max-width: 768px) {
    .blossom-app .nav-link1s {
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

    .blossom-app .nav-link1s.active {
        right: 0;
    }

    .blossom-app .mobile-menu-btn {
        display: flex;
    }

    .blossom-app .mobile-menu-btn.active span:nth-child(1) {
        transform: translateY(8px) rotate(45deg);
    }

    .blossom-app .mobile-menu-btn.active span:nth-child(2) {
        opacity: 0;
    }

    .blossom-app .mobile-menu-btn.active span:nth-child(3) {
        transform: translateY(-8px) rotate(-45deg);
    }

    .blossom-app .hero h1 {
        font-size: 36px;
    }

    .blossom-app .hero p {
        font-size: 16px;
    }

    .blossom-app .section-title {
        font-size: 28px;
    }

    .blossom-app .newsletter-form {
        flex-direction: column;
    }

    .blossom-app .newsletter-input {
        border-radius: 50px;
        margin-bottom: 10px;
    }

    .blossom-app .newsletter-btn {
        border-radius: 50px;
    }
}

@media (max-width: 576px) {
    .blossom-app .hero h1 {
        font-size: 28px;
    }
    
    .blossom-app .hero-btns {
        flex-direction: column;
        gap: 10px;
    }

    .blossom-app .btn {
        width: 100%;
        text-align: center;
    }
}
`;

// Inject styles
const styleElement = document.createElement('style');
styleElement.innerHTML = styles;
document.head.appendChild(styleElement);

export default BlossomFlowers;