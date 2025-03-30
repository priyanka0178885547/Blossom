import React from 'react';
import './About.css';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';

export default function About() {
  return (
    <div className="about-container">
      <h1>About Blossom</h1>
      <p>
        Welcome to Blossom, your go-to online platform for discovering and purchasing rare flowers.
        Our mission is to connect flower enthusiasts with the most beautiful and unique blooms available.
      </p>
      <p>
        Whether you're a gardening hobbyist or simply a lover of nature's beauty, we ensure a seamless experience
        in finding the perfect flowers. Our team works directly with trusted nurseries to bring you the best.
      </p>
      
      <footer className="footer">
        <div className="social-media">
          <h3>Follow Us</h3>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
        </div>
        
        <div className="footer-links">
          <a href="/privacy">Privacy Policy</a>
          <a href="/customer-rights">Customer Rights</a>
        </div>
      </footer>
    </div>
  );
}
