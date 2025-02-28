// react_auth_setup.jsx
// Example React app with Bootstrap for user registration, login, password reset (forgot/reset), and protected route.
// This sample uses the concepts from the guide.
// In practice, you'll organize these components into separate files.

import React, { useState, useEffect, createContext, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate, useLocation } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import { useAuth } from '../AuthContext';

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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { loginUser } = useAuth();

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

// ============================
// Main App
// ============================

function App() {
  return (
    <Router>
      <AuthProvider>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container">
            <Link className="navbar-brand" to="/">MyApp</Link>
            <div>
              <ul className="navbar-nav">
                <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/register">Register</Link></li>
              </ul>
            </div>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/dashboard" element={
            <PrivateRoute>
              {/* <DashboardPage /> */}
            </PrivateRoute>
          }/>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
