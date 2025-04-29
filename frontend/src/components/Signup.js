
import React, { useState, useEffect } from 'react';
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaShoppingCart, 
  FaStore,
} from 'react-icons/fa';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import { useNavigate } from 'react-router-dom';


// Global styles
const GlobalStyle = createGlobalStyle`
  :root {
    --blue: #a78bfa;
    --lavender: #b57edc;
    --purple:rgb(225, 106, 158);

    
    --pink:rgb(157, 100, 222);
    --dark: #2b2d42;
    --light: #f8f9fa;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  body {
    // min-height: 80vh;
    //height :90vh;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow-x: hidden;
    //width : 40vw;
    background: linear-gradient(135deg, var(--blue), var(--lavender), var(--purple), var(--pink));
    animation: gradientShift 12s ease infinite;
    background-size: 400% 400%;
  }

  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;

// Animations
const float = keyframes`
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 0.15;
  }
  100% {
    transform: translateY(-1000px) rotate(720deg);
    opacity: 0;
  }
`;

const popIn = keyframes`
  0% { transform: scale(0.95); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
`;

const titleColorShift = keyframes`
  0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
`;

const buttonColorShift = keyframes`
  0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Components
const FloatingShapes = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
`;

const Shape = styled.div`
  position: absolute;
  opacity: 0.15;
  animation: ${float} linear infinite;
  
  ${props => props.type === 'circle' && `
    border-radius: 50%;
    background: ${props.color || 'var(--light)'};
    width: ${props.size}px;
    height: ${props.size}px;
  `}
  
  ${props => props.type === 'triangle' && `
    width: 0;
    height: 0;
    border-left: 20px solid transparent;
    border-right: 20px solid transparent;
    border-bottom: 35px solid ${props.color || 'var(--light)'};
  `}
  
  ${props => props.type === 'square' && `
    background: ${props.color || 'var(--light)'};
    transform: rotate(45deg);
    width: ${props.size}px;
    height: ${props.size}px;
  `}
  
  left: ${props => props.left}%;
  animation-duration: ${props => props.duration}s;
  animation-delay: ${props => props.delay}s;
`;

const SignupContainer = styled.div`
  //position: relative;
  //top:30px;
  z-index: 1;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  padding: 30px;
  //width: ;
  mix-width: 1000px;
  max-height :100vh;
  transform: scale(0.95);
  opacity: 0;
  animation: ${popIn} 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  margin-top: 44px;
  &:hover {
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    transform: translateY(-5px) scale(1);
  }

  @media (max-width: 768px) {
    padding: 30px 20px;
    width: 95%;
  }
`;

const SignupHeader = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const SignupTitle = styled.h1`
  color: var(--dark);
  font-size: 2.5rem;
  margin-bottom: 10px;
  background: linear-gradient(to right, var(--blue), var(--lavender), var(--purple), var(--pink));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: ${titleColorShift} 8s ease infinite;
  background-size: 300% 300%;

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.8rem;
  }
`;

const SignupSubtitle = styled.p`
  color: var(--dark);
  opacity: 0.8;
  font-size: 1rem;
`;

const Message = styled.div`
  text-align: center;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 20px;
  animation: ${fadeIn} 0.5s ease;
  display: ${props => props.show ? 'block' : 'none'};
  
  ${props => props.type === 'success' && `
    background: rgba(74, 107, 255, 0.2);
    color: #1a3a8f;
  `}
  
  ${props => props.type === 'error' && `
    background: rgba(255, 107, 158, 0.2);
    color: #c23b6e;
  `}
`;

const SignupForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  position: relative;
`;

const SignupInput = styled.input`
  width: 100%;
  padding: 15px 20px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 50px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.9);
  
  &:focus {
    outline: none;
    border-color: var(--purple);
    box-shadow: 0 0 0 3px rgba(138, 43, 226, 0.2);
  }

  @media (max-width: 480px) {
    padding: 12px 15px;
  }
`;

const InputIcon = styled.div`
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  
  ${SignupInput}:focus + & {
    color: var(--purple);
  }
`;

const RoleSelector = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  gap: 10px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const RoleOption = styled.div`
  flex: 1;
  text-align: center;
  padding: 15px;
  border-radius: 50px;
  background: ${props => props.active ? 'var(--purple)' : 'rgba(0, 0, 0, 0.05)'};
  cursor: pointer;
  transition: all 0.3s ease;
  color: ${props => props.active ? 'white' : 'var(--dark)'};
  box-shadow: ${props => props.active ? '0 5px 15px rgba(138, 43, 226, 0.4)' : 'none'};
  
  &:hover {
    transform: translateY(-3px);
  }
`;

const SignupButton = styled.button`
  background: linear-gradient(to right, var(--blue), var(--lavender), var(--pink));
  color: white;
  border: none;
  padding: 15px;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  animation: ${buttonColorShift} 8s ease infinite;
  background-size: 300% 300%;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to right, rgba(255, 255, 255, 0.3), transparent);
    transform: translateX(-100%);
    transition: transform 0.5s ease;
  }
  
  &:hover::after {
    transform: translateX(100%);
  }

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

const LoginLink = styled.p`
  text-align: center;
  margin-top: 20px;
  color: var(--dark);
`;

const StyledLink = styled.a`
  color: var(--purple);
  text-decoration: none;
  font-weight: bold;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background: var(--purple);
    transition: width 0.3s ease;
  }
  
  &:hover::after {
    width: 100%;
  }
`;

const SocialLogin = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
`;

const SocialIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => 
    props.type === 'facebook' ? '#3b5998' :
    props.type === 'google' ? '#db4437' :
    props.type === 'twitter' ? '#1da1f2' : ''
  };
  
  &:hover {
    transform: translateY(-3px) scale(1.1);
  }
`;

const RainbowSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'buyer'
  });
  const [message, setMessage] = useState({ text: '', type: '', show: false });
  const [shapes, setShapes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    createShapes();
  }, []);

  const createShapes = () => {
    const shapeTypes = ['circle', 'triangle', 'square'];
    const colors = [
      'rgba(74, 107, 255, 0.4)', 
      'rgba(181, 126, 220, 0.4)', 
      'rgba(138, 43, 226, 0.4)', 
      'rgba(255, 107, 158, 0.4)'
    ];
    
    const newShapes = [];
    for (let i = 0; i < 15; i++) {
      const type = shapeTypes[Math.floor(Math.random() * 3)];
      const size = type === 'triangle' ? null : Math.random() * (type === 'circle' ? 40 : 30) + 10;
      const left = Math.random() * 100;
      const duration = Math.random() * 10 + 10;
      const delay = Math.random() * 5;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      newShapes.push({ type, size, left, duration, delay, color });
    }
    setShapes(newShapes);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (role) => {
    setFormData(prev => ({ ...prev, role }));
  };

  const handleSocialLogin = (platform) => {
    alert(`${platform} login would be implemented here`);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const { name, email, password, confirmPassword, role } = formData;
  
    setMessage({ text: '', type: '', show: false });
  
    // Validate password
    if (password.length < 8) {
      setMessage({ text: 'Password must be at least 8 characters long', type: 'error', show: true });
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setMessage({ text: 'Password must contain at least one uppercase letter', type: 'error', show: true });
      return;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      setMessage({ text: 'Password must contain at least one special character', type: 'error', show: true });
      return;
    }
    if (password !== confirmPassword) {
      setMessage({ text: 'Passwords do not match', type: 'error', show: true });
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/api/signup', {  // Update URL if different
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password, role })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setMessage({ text: data.message || 'Account created successfully! Redirecting...', type: 'success', show: true });
  
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setMessage({ text: data.message || 'Signup failed', type: 'error', show: true });
      }
    } catch (error) {
      console.error('Error during signup:', error);
      setMessage({ text: 'An error occurred. Please try again later.', type: 'error', show: true });
    }
  };
  

  return (
    <>
      <GlobalStyle />
      
      <FloatingShapes>
        {shapes.map((shape, index) => (
          <Shape
            key={index}
            type={shape.type}
            size={shape.size}
            left={shape.left}
            duration={shape.duration}
            delay={shape.delay}
            color={shape.color}
          />
        ))}
      </FloatingShapes>
      
      <SignupContainer>
        <SignupHeader>
          <SignupTitle>Join Our Marketplace</SignupTitle>
          <SignupSubtitle>Create your account in seconds</SignupSubtitle>
        </SignupHeader>

        <Message show={message.show} type={message.type}>
          {message.text}
        </Message>

        <SignupForm onSubmit={handleSubmit}>
          <InputGroup>
            <SignupInput
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <InputIcon>
              <FaUser />
            </InputIcon>
          </InputGroup>

          <InputGroup>
            <SignupInput
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <InputIcon>
              <FaEnvelope />
            </InputIcon>
          </InputGroup>

          <InputGroup>
            <SignupInput
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <InputIcon>
              <FaLock />
            </InputIcon>
          </InputGroup>

          <InputGroup>
            <SignupInput
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
            <InputIcon>
              <FaLock />
            </InputIcon>
          </InputGroup>

          <RoleSelector>
            <RoleOption 
              active={formData.role === 'buyer'}
              onClick={() => handleRoleChange('buyer')}
            >
              <FaShoppingCart /> Buyer
            </RoleOption>
            <RoleOption 
              active={formData.role === 'seller'}
              onClick={() => handleRoleChange('seller')}
            >
              <FaStore /> Seller
            </RoleOption>
          </RoleSelector>

          <SignupButton type="submit">Sign Up Now</SignupButton>

          {/* <SocialLogin>
            <SocialIcon type="facebook" onClick={() => handleSocialLogin('Facebook')}>
              <FaFacebookF />
            </SocialIcon>
            <SocialIcon type="google" onClick={() => handleSocialLogin('Google')}>
              <FaGoogle />
            </SocialIcon>
            <SocialIcon type="twitter" onClick={() => handleSocialLogin('Twitter')}>
              <FaTwitter />
            </SocialIcon>
          </SocialLogin> */}
        </SignupForm>

        <LoginLink>Already have an account? <StyledLink href="login">Login here</StyledLink></LoginLink>
      </SignupContainer>
    </>
  );
};

export default RainbowSignup;