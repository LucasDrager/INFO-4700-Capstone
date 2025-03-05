import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../components/login-components/loginstyle.css";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    setError(''); // Clear any previous errors when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (formData.username && formData.password) {
        // Successful login simulation
        console.log('Login successful:', formData.username);
        navigate('/dashboard');
      } else {
        setError('Please fill in all fields');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Lectern</h1>
        <p className="subtitle">Your gateway to interactive learning</p>
        
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
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
          <button className="social-button facebook" aria-label="Login with Facebook">
            <i className="fab fa-facebook-f"></i>
          </button>
          <button className="social-button google" aria-label="Login with Google">
            <i className="fab fa-google"></i>
          </button>
          <button className="social-button github" aria-label="Login with GitHub">
            <i className="fab fa-github"></i>
          </button>
        </div>

        <p className="signup-text">
          Don't have an Account? <a href="/signup">Sign Up</a>
        </p>
      </div>

      <div className="login-image">
        <div className="image-container">
          <div className="floating-card">
            <h3>Welcome to Lectern</h3>
            <p>Join our community of learners and educators in an interactive educational experience.</p>
          </div>
        </div>
        <div className="dots">
          <span className="dot active"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;