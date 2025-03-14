// ============================
// Login Page
// ============================

import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../components/login-components/loginstyle.css";
import { useAuth, AuthProvider } from "../AuthContext";
const API_BASE = process.env.REACT_APP_API_BASE;

// Authentication state and functions
const { authTokens, setAuthTokens, currentUser, setCurrentUser, loginUser } = useAuth();
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState(null);
const navigate = useNavigate();

// UI states for slider and modals
const [currentSlide, setCurrentSlide] = useState(0);
const [isDragging, setIsDragging] = useState(false);
const [startPos, setStartPos] = useState(0);
const [currentTranslate, setCurrentTranslate] = useState(0);
const [prevTranslate, setPrevTranslate] = useState(0);
const [isAutoPlaying, setIsAutoPlaying] = useState(true);
const autoPlayRef = useRef();
const sliderRef = useRef(null);
const [socialLoginModal, setSocialLoginModal] = useState({
  isOpen: false,
  provider: ""
});
const [registrationModal, setRegistrationModal] = useState(false);

// Slider content
const slides = [
  {
    title: "Welcome to Lectern",
    description:
      "Join our community of learners and educators in an interactive educational experience."
  },
  {
    title: "Interactive Learning",
    description:
      "Engage with our interactive learning tools and games to enhance your educational journey."
  },
  {
    title: "Track Progress",
    description:
      "Monitor your learning progress and achievements through our comprehensive dashboard."
  }
];

// ==============================
// Social Login Modal Component
// ==============================
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
              onChange={(e) =>
                setSocialFormData({ ...socialFormData, email: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={socialFormData.password}
              onChange={(e) =>
                setSocialFormData({ ...socialFormData, password: e.target.value })
              }
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

// ==============================
// Registration Modal Component
// ==============================
const RegistrationModal = ({ isOpen, onClose, onRegister }) => {
  const [registrationData, setRegistrationData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    if (registrationData.password !== registrationData.confirmPassword) {
      alert("Passwords don't match");
      return;
    }
  
    try {
      const res = await fetch(`${API_BASE}register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: registrationData.username,
          email: registrationData.email,
          password: registrationData.password
        })
      });
  
      if (res.status === 201) {
        navigate('/dashboard');  // or wherever users should go after registration
      } else {
        const data = await res.json();
        alert(`Registration error: ${data.message || JSON.stringify(data)}`);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }
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
              onChange={(e) =>
                setRegistrationData({ ...registrationData, username: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={registrationData.email}
              onChange={(e) =>
                setRegistrationData({ ...registrationData, email: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={registrationData.password}
              onChange={(e) =>
                setRegistrationData({ ...registrationData, password: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Confirm Password"
              value={registrationData.confirmPassword}
              onChange={(e) =>
                setRegistrationData({ ...registrationData, confirmPassword: e.target.value })
              }
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

// ==============================
// Merged LoginPage Component
// ==============================
function LoginPage() {
  // Auto-play functionality for the slider
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(() => {
        goToNextSlide();
      }, 5000);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isAutoPlaying, currentSlide]);

  // Slider functions
  const goToNextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
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
      setCurrentSlide((prev) => prev - 1);
      setCurrentTranslate(-(currentSlide - 1) * 100);
      setPrevTranslate(-(currentSlide - 1) * 100);
    }
  };

  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
  };

  const handleMouseLeave = () => {
    setIsAutoPlaying(true);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartPos(e.clientX);
    setPrevTranslate(currentTranslate);
    if (sliderRef.current) {
      sliderRef.current.style.cursor = "grabbing";
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const currentPosition = e.clientX;
    const diff = currentPosition - startPos;
    const newTranslate = prevTranslate + diff;
    const maxTranslate = 0;
    const minTranslate = -(slides.length - 1) * 100;
    if (newTranslate <= maxTranslate && newTranslate >= minTranslate) {
      setCurrentTranslate(newTranslate);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (sliderRef.current) {
      sliderRef.current.style.cursor = "grab";
    }
    const slideWidth = 100;
    const newSlide = Math.round(Math.abs(currentTranslate) / slideWidth);
    setCurrentSlide(newSlide);
    setCurrentTranslate(-newSlide * slideWidth);
    setPrevTranslate(-newSlide * slideWidth);
  };

  const handleMouseLeaveSlider = () => {
    if (isDragging) {
      handleMouseUp();
    }
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setStartPos(touch.clientX);
    setPrevTranslate(currentTranslate);
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const currentPosition = touch.clientX;
    const diff = currentPosition - startPos;
    const newTranslate = prevTranslate + diff;
    const maxTranslate = 0;
    const minTranslate = -(slides.length - 1) * 100;
    if (newTranslate <= maxTranslate && newTranslate >= minTranslate) {
      setCurrentTranslate(newTranslate);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    const slideWidth = 100;
    const newSlide = Math.round(Math.abs(currentTranslate) / slideWidth);
    setCurrentSlide(newSlide);
    setCurrentTranslate(-newSlide * slideWidth);
    setPrevTranslate(-newSlide * slideWidth);
  };

  const handleDotClick = (index) => {
    setCurrentSlide(index);
    setCurrentTranslate(-index * 100);
    setPrevTranslate(-index * 100);
  };

  // ------------------------------
  // Authentication Handler
  // ------------------------------

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await loginUser(username, password);
    if (response.success) {
        navigate("/dashboard");
    } else {
      // handle login failure
      setError(response.message);
    }
  };

  // ------------------------------
  // Social Login and Registration Handlers
  // ------------------------------
  const handleSocialLogin = (provider) => {
    setSocialLoginModal({ isOpen: true, provider });
  };

  const handleSocialLoginSubmit = (data) => {
    console.log(`${socialLoginModal.provider} login:`, data);
    navigate("/dashboard");
  };

  const handleRegistration = (data) => {
    console.log("Registration data:", data);
    navigate("/dashboard");
  };

  console.log("Using Auth/LoginPage.js");

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Lectern</h1>
        <p className="subtitle">Your gateway to interactive learning</p>
        <form onSubmit={handleLogin}>
          {error && <div className="error-message">{error}</div>}
          <div className="form-group">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        <div className="divider">
          <span>or</span>
        </div>
        <div className="social-login">
          <button
            className="social-button facebook"
            aria-label="Login with Facebook"
            onClick={() => handleSocialLogin("Facebook")}
          >
            <i className="fab fa-facebook-f"></i>
          </button>
          <button
            className="social-button google"
            aria-label="Login with Google"
            onClick={() => handleSocialLogin("Google")}
          >
            <i className="fab fa-google"></i>
          </button>
          <button
            className="social-button github"
            aria-label="Login with GitHub"
            onClick={() => handleSocialLogin("GitHub")}
          >
            <i className="fab fa-github"></i>
          </button>
        </div>
        <p className="signup-text">
          Don't have an Account?{" "}
          <button onClick={() => setRegistrationModal(true)} className="signup-link">
            Sign Up
          </button>
        </p>
      </div>
      <div className="login-image">
        <div
          ref={sliderRef}
          className="slider-container"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeaveSlider}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <button
            className="slider-arrow prev"
            onClick={goToPrevSlide}
            style={{ visibility: currentSlide === 0 ? "hidden" : "visible" }}
          >
            &#8249;
          </button>
          <button
            className="slider-arrow next"
            onClick={goToNextSlide}
            style={{ visibility: currentSlide === slides.length - 1 ? "hidden" : "visible" }}
          >
            &#8250;
          </button>
          <div
            className="slider-track"
            style={{
              transform: `translateX(${currentTranslate}%)`,
              transition: isDragging ? "none" : "transform 0.3s ease-out"
            }}
          >
            {slides.map((slide, index) => (
              <div key={index} className="slide">
                <div className="floating-card">
                  <h3>{slide.title}</h3>
                  <p>{slide.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="dots">
          {slides.map((_, index) => (
            <span
              key={index}
              className={`dot ${currentSlide === index ? "active" : ""}`}
              onClick={() => {
                setCurrentSlide(index);
                setCurrentTranslate(-index * 100);
                setPrevTranslate(-index * 100);
              }}
            />
          ))}
        </div>
      </div>
      <SocialLoginModal
        isOpen={socialLoginModal.isOpen}
        provider={socialLoginModal.provider}
        onClose={() => setSocialLoginModal({ isOpen: false, provider: "" })}
        onLogin={handleSocialLoginSubmit}
      />
      <RegistrationModal
        isOpen={registrationModal}
        onClose={() => setRegistrationModal(false)}
        onRegister={handleRegistration}
        setError={setError}
      />
    </div>
  );
}

export default LoginPage;

