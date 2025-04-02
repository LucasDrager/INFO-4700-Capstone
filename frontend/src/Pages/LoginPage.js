import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import "../components/login-components/loginstyle.css";

// Social Login Modal Component
const SocialLoginModal = ({ isOpen, onClose, provider, onLogin }) => {
  const [socialFormData, setSocialFormData] = useState({
    email: '',
    password: ''
  });

  const handleSocialSubmit = (e) => {
    e.preventDefault();
    onLogin(socialFormData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Login with {provider}</h2>
        <form onSubmit={handleSocialSubmit}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={socialFormData.email}
              onChange={(e) => setSocialFormData({...socialFormData, email: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={socialFormData.password}
              onChange={(e) => setSocialFormData({...socialFormData, password: e.target.value})}
              required
            />
          </div>
          <button type="submit" className="login-button">
            Login with {provider}
          </button>
          <button type="button" className="close-button" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

// Registration Modal Component
const RegistrationModal = ({ isOpen, onClose, onRegister }) => {
  const [registrationData, setRegistrationData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleRegistrationSubmit = (e) => {
    e.preventDefault();
    if (registrationData.password !== registrationData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    onRegister(registrationData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Create Account</h2>
        <form onSubmit={handleRegistrationSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Username"
              value={registrationData.username}
              onChange={(e) => setRegistrationData({...registrationData, username: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={registrationData.email}
              onChange={(e) => setRegistrationData({...registrationData, email: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={registrationData.password}
              onChange={(e) => setRegistrationData({...registrationData, password: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Confirm Password"
              value={registrationData.confirmPassword}
              onChange={(e) => setRegistrationData({...registrationData, confirmPassword: e.target.value})}
              required
            />
          </div>
          <button type="submit" className="login-button">
            Create Account
          </button>
          <button type="button" className="close-button" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [prevTranslate, setPrevTranslate] = useState(0);
  const navigate = useNavigate();
  const [socialLoginModal, setSocialLoginModal] = useState({
    isOpen: false,
    provider: ''
  });
  const [registrationModal, setRegistrationModal] = useState(false);
  const sliderRef = useRef(null);

  // Slider content
  const slides = [
    {
      title: "Welcome to Lectern",
      description: "Elevate your reading experience."
    },
    {
      title: "Interactive Learning",
      description: "Engage with our interactive learning tools and games to enhance your educational journey."
    },
    {
      title: "Track Progress",
      description: "Monitor your learning progress and achievements through our dashboard."
    }
  ];

  const goToNextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
      setCurrentTranslate(-(currentSlide + 1) * 100);
      setPrevTranslate(-(currentSlide + 1) * 100);
    } else {
      setCurrentSlide(0);
      setCurrentTranslate(0);
      setPrevTranslate(0);
    }
  };

  const goToPrevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
      setCurrentTranslate(-(currentSlide - 1) * 100);
      setPrevTranslate(-(currentSlide - 1) * 100);
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartPos(e.clientX);
    setPrevTranslate(currentTranslate);
    if (sliderRef.current) {
      sliderRef.current.style.cursor = 'grabbing';
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const currentPosition = e.clientX;
    const diff = currentPosition - startPos;
    const newTranslate = prevTranslate + diff;
    
    // Limit sliding to prevent going beyond first and last slides
    if (newTranslate > 0 || newTranslate < -((slides.length - 1) * 100)) return;
    
    setCurrentTranslate(newTranslate);
    if (sliderRef.current) {
      sliderRef.current.style.transform = `translateX(${newTranslate}%)`;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    const movedBy = currentTranslate - prevTranslate;
    
    if (movedBy < -100 && currentSlide < slides.length - 1) {
      goToNextSlide();
    }
    if (movedBy > 100 && currentSlide > 0) {
      goToPrevSlide();
    }
    
    if (sliderRef.current) {
      sliderRef.current.style.cursor = 'grab';
      sliderRef.current.style.transform = `translateX(${currentTranslate}%)`;
    }
  };

  const handleMouseLeaveSlider = () => {
    if (isDragging) {
      handleMouseUp();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your login logic here
    navigate('/dashboard');
  };

  const handleSocialLogin = (provider) => {
    setSocialLoginModal({
      isOpen: true,
      provider: provider
    });
  };

  const handleSocialLoginSubmit = (data) => {
    // Add your social login logic here
    console.log(`Logging in with ${socialLoginModal.provider}:`, data);
    navigate('/dashboard');
  };

  const handleRegistration = (data) => {
    // Add your registration logic here
    console.log('Registration data:', data);
    navigate('/dashboard');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-form">
          <h2>Login to Lectern</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
            <button type="submit" className="login-button">Login</button>
          </form>
          
          <div className="social-login">
            <button onClick={() => handleSocialLogin('Google')} className="google-login">
              Login with Google
            </button>
            <button onClick={() => handleSocialLogin('Facebook')} className="facebook-login">
              Login with Facebook
            </button>
          </div>
          
          <div className="register-link">
            <p>Don't have an account? <button onClick={() => setRegistrationModal(true)}>Register</button></p>
          </div>
        </div>
        
        <div 
          ref={sliderRef}
          className="slider-container"
          onMouseLeave={handleMouseLeaveSlider}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <div className="slider" style={{ transform: `translateX(${currentTranslate}%)` }}>
            {slides.map((slide, index) => (
              <div key={index} className="slide">
                <h2>{slide.title}</h2>
                <p>{slide.description}</p>
              </div>
            ))}
          </div>
          <div className="slider-nav">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`nav-dot ${currentSlide === index ? 'active' : ''}`}
                onClick={() => {
                  setCurrentSlide(index);
                  setCurrentTranslate(-index * 100);
                  setPrevTranslate(-index * 100);
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <SocialLoginModal
        isOpen={socialLoginModal.isOpen}
        onClose={() => setSocialLoginModal({...socialLoginModal, isOpen: false})}
        provider={socialLoginModal.provider}
        onLogin={handleSocialLoginSubmit}
      />

      <RegistrationModal
        isOpen={registrationModal}
        onClose={() => setRegistrationModal(false)}
        onRegister={handleRegistration}
      />
    </div>
  );
};

export default LoginPage;