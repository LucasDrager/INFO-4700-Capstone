// ============================
// Dashboard (Protected)
// ============================
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function DashboardPage() {
  const { currentUser, logoutUser } = useAuth();
  return (
    <div className="container mt-5">
      <h2>Welcome to Dashboard</h2>
      <p>You are logged in as: <strong>{currentUser}</strong></p>
      <button className="btn btn-danger" onClick={logoutUser}>Logout</button>
    </div>
  );
}