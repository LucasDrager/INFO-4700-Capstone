// ============================
// Reset Password (Confirm)
// ============================
// In reality, you'd parse uid/token from the URL.
// For demonstration, we'll do it with query params.
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const API_BASE = process.env.REACT_APP_API_BASE;

function ResetPasswordPage() {
    const searchParams = new URLSearchParams(useLocation().search);
    const uid = searchParams.get('uid');
    const token = searchParams.get('token');
  
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
  
    const handleReset = async (e) => {
      e.preventDefault();
      if (newPassword !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
  
      setError(null);
      setMessage(null);
  
      try {
        // This endpoint would finalize the reset.
        const res = await fetch(`${API_BASE}password-reset-confirm/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ uid, token, password: newPassword })
        });
        if (res.ok) {
          setMessage("Password reset successful. You can now log in.");
        } else {
          const data = await res.json();
          setError(JSON.stringify(data));
        }
      } catch (err) {
        console.error(err);
        setError("Network error.");
      }
    };
  
    return (
      <div className="container mt-5" style={{ maxWidth: '400px' }}>
        <h2>Reset Password</h2>
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleReset}>
          <div className="form-group mb-3">
            <label>New Password</label>
            <input
              type="password"
              className="form-control"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label>Confirm Password</label>
            <input
              type="password"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Reset Password</button>
        </form>
      </div>
    );
  }
  export default ResetPasswordPage;