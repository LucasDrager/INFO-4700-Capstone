import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, Outlet } from "react-router-dom";

import Header from "./components/Header"; 
import HomePage from "./Pages/HomePage";
import AboutPage from "./Pages/AboutPage";
import ContactPage from "./Pages/ContactPage";
import ChatPage from "./Pages/ChatPage";

// Import your auth-related components
import { AuthProvider, useAuth } from "./auth/AuthContext"; 
import LoginPage from "./auth/LoginPage";
import RegisterPage from "./Auth/RegisterPage.js";
import ForgotPasswordPage from "./Auth/ForgotPasswordPage.js/index.js";
import ResetPasswordPage from "./auth/ResetPasswordPage";

// 1) PrivateOutlet checks if user is logged in before rendering child routes
function PrivateOutlet() {
  const { currentUser } = useAuth();
  return currentUser ? <Outlet /> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Router>
      {/* Provide Auth context to entire app */}
      <AuthProvider>
        <Header /> {/* Global header for all pages */}
        
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          {/* 
            Global nav: 
            Home, About, Contact = public routes
            For your LLM or Chat, let's assume it’s protected under /app/LLM, 
            so the link would be /app/LLM if you want it locked behind login
          */}
          <nav>
            <Link to="/" style={{ margin: "10px" }}>Home</Link>
            <Link to="/about" style={{ margin: "10px" }}>About</Link>
            <Link to="/contact" style={{ margin: "10px" }}>Contact</Link>
            {/* Link to /app/LLM if you want Chat behind auth */}
            <Link to="/LLM" style={{ margin: "10px" }}>LLM</Link>
          </nav>

          <Routes>
            {/* ================================
                Public (Unprotected) routes
               ================================ */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Auth pages (still public) */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* ================================
                Protected (Nested) routes under /app
               ================================ */}
            <Route element={<PrivateOutlet />}>
              {/*
                Any route nested under this parent is protected.
                The user must be logged in to access them.
              */}
              <Route path="/LLM" element={<ChatPage />} />
              {/* You could add more protected pages here, e.g.: */}
              {/* <Route path="/app/dashboard" element={<DashboardPage />} /> */}
              {/* <Route path="/app/profile" element={<ProfilePage />} /> */}
            </Route>

            {/* Catch-all or fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
