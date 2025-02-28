// react_auth_setup.jsx
// Example React app with Bootstrap for user registration, login, password reset (forgot/reset), and protected route.
// This sample uses the concepts from the guide.
// In practice, you'll organize these components into separate files.

import React, { useState, useEffect, createContext, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate, useLocation } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import { useAuth, AuthProvider } from '../AuthContext';
const API_BASE = process.env.REACT_APP_API_BASE;
// ============================
// Protected Route component
// ============================

// function PrivateRoute({ children }) {
//   const { currentUser } = useAuth();
//   if (!currentUser) {
//     return <Navigate to="/login" replace />;
//   }
//   return children;
// }

// ============================
// Login Page
// ============================

function LoginPage() {
  const { loginUser, authTokens, setAuthTokens, currentUser, setCurrentUser } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:8000/api/token/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (res.ok) {
      // Expect data = { access: '...', refresh: '...' }
      localStorage.setItem('authTokens', JSON.stringify(data));  // store tokens
      setAuthTokens(data);
      setCurrentUser(jwtDecode(data.access));  // decode token to get user info (optional)
      // redirect to dashboard or home
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <h2>Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleLogin}>
        <div className="form-group mb-3">
          <label>Username</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
      <div className="mt-3">
        <span>Don't have an account? <Link to="/register">Register</Link></span>
      </div>
    </div>
  );
}

export default LoginPage;
