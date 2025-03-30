// import React from 'react';
// import './About.css';
// import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';

// const About = () => {
//   return (
//     <div className="about-container">
//       {/* About Section */}
//       <h1 className="section-title">About Blossom</h1>
//       <p className="section-description">
//         Blossom is your ultimate online destination for discovering and purchasing rare flowers. Our platform offers a seamless experience to flower enthusiasts, enabling them to find, learn about, and buy exotic blooms from the finest nurseries across India. We aim to bridge the gap between nature and people, bringing vibrant greenery into your homes.
//       </p>

//       {/* Why Choose Blossom Section */}
//       <h2 className="section-title">Why Choose Blossom?</h2>
//       <p>With Blossom, finding your favorite flowers is easier than ever. Our advanced search feature allows you to:</p>
//       <ul className="feature-list">
//         <li><strong>Search using images:</strong> Simply upload a photo to find matching flowers.</li>
//         <li><strong>Filter by color:</strong> Explore flowers based on your preferred color palette.</li>
//         <li><strong>Use local language:</strong> Browse through thousands of flowers in your native language.</li>
//       </ul>
//       <p>Supporting regional nurseries and small-scale plant growers, we believe in promoting sustainability and encouraging a love for gardening. Every plant you purchase supports local businesses and contributes to a greener environment.</p>

//       {/* Additional Features */}
//       <h2 className="section-title">Blossom also provides:</h2>
//       <ul className="feature-list">
//         <li>Personalized recommendations based on your interests.</li>
//         <li>Detailed care instructions to help your flowers thrive.</li>
//         <li>Live chat support with gardening experts for real-time assistance.</li>
//       </ul>
//       <p>From rare orchids and fragrant roses to vibrant tulips and exotic succulents, Blossom offers a wide variety of options. Experience the beauty of nature with us!</p>

//       {/* Footer Section */}
//       <footer className="footer">
//         <div className="footer-links">
//           <a href="/privacy">Privacy Policy</a>
//           <a href="/customer-rights">Customer Rights</a>
//         </div>

//         <div className="social-media">
//           <h3>Follow Us</h3>
//           <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
//           <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
//           <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
//           <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default About;

import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';

export default function About() {
  return (
    <div style={{ backgroundColor: 'white', padding: '80px 40px', textAlign: 'center' }}>
      <h1 style={{ color: '#00796b', fontSize: '2.5rem', marginBottom: '30px' }}>About Blossom</h1>
      <p style={{ color: '#333', fontSize: '1.2rem', marginBottom: '40px' }}>
        Blossom is your go-to platform for discovering and purchasing rare flowers. We offer a seamless experience for flower enthusiasts, connecting you with nurseries across India. Embrace nature’s beauty and bring vibrant greenery into your home with Blossom.
      </p>

      <h2 style={{ color: '#00574b', fontSize: '2rem', marginTop: '50px', marginBottom: '20px' }}>Why Choose Blossom?</h2>
      <ul style={{ listStylePosition: 'inside', marginBottom: '40px' }}>
        <li><strong>Search using images:</strong> Upload a photo to find matching flowers.</li>
        <li><strong>Filter by color:</strong> Find flowers based on your favorite shades.</li>
        <li><strong>Use local language:</strong> Browse in your preferred language.</li>
      </ul>

      <h2 style={{ color: '#00574b', fontSize: '2rem', marginTop: '50px', marginBottom: '20px' }}>Blossom also provides:</h2>
      <ul style={{ listStylePosition: 'inside', marginBottom: '40px' }}>
        <li>Personalized flower recommendations.</li>
        <li>Detailed plant care tips.</li>
        <li>Live chat support with gardening experts.</li>
      </ul>

      <footer style={{ marginTop: '60px', paddingTop: '20px', borderTop: '1px solid #ccc', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <a href="/privacy" style={{ color: '#00796b', marginRight: '20px', textDecoration: 'none' }}>Privacy Policy</a>
          <a href="/customer-rights" style={{ color: '#00796b', textDecoration: 'none' }}>Customer Rights</a>
        </div>

        <div>
          <h3 style={{ marginBottom: '10px' }}>Follow Us</h3>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ color: '#00796b', fontSize: '24px', marginRight: '15px', textDecoration: 'none' }}><FaFacebook /></a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: '#00796b', fontSize: '24px', marginRight: '15px', textDecoration: 'none' }}><FaInstagram /></a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ color: '#00796b', fontSize: '24px', marginRight: '15px', textDecoration: 'none' }}><FaTwitter /></a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={{ color: '#00796b', fontSize: '24px', textDecoration: 'none' }}><FaLinkedin /></a>
        </div>
      </footer>
    </div>
  );
}
