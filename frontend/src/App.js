import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth, AuthProvider } from './AuthContext.js';

// Import Components
import Header from "./components/Header"; 

// Import Public Pages
import HomePage from "./Pages/HomePage";
import AboutPage from "./Pages/AboutPage";
import ContactPage from "./Pages/ContactPage.js";
import ChatPage from "./Pages/ChatPage";
import GamesPage from "./Pages/GamesPage";

// Import Protected Pages
import Dashboard from "./Pages/Dashboard";
import Settings from "./Pages/Settings";
import ReadingModePage from "./Pages/ReadingMode";

// Import Authentication Pages
import LoginPage from "./Auth/LoginPage.js";
import RegisterPage from "./Auth/RegisterPage.js";
import ForgotPasswordPage from "./Auth/ForgotPasswordPage.js";
import ResetPasswordPage from "./Auth/ResetPasswordPage";



// ============================
// Private Route Wrapper
// ============================
function PrivateOutlet() {
  const { currentUser } = useAuth();
  return currentUser ? <Outlet /> : <Navigate to="/login" replace />;
}

// ============================
// App Content (Handles Navigation & Pages)
// ============================
function AppContent() {
  const location = useLocation();

  // Hide the navbar on certain pages
  const hideHeaderNav = ["/dashboard", "/settings", "/gamespage", "/GamesPage", "/reading-mode"].includes(location.pathname);

  return (
    <>
      {/* Conditionally display the header */}
      {!hideHeaderNav && <Header />}

      {/* Conditionally display the navigation bar */}
      {!hideHeaderNav && (
        <nav style={{ marginTop: "20px", textAlign: "center" }}>
        <Link to="/" style={{ margin: "10px",
            fontSize: "24px",
            fontWeight: "bold",
            textDecoration: "none",
            color: "#0072e5",
            cursor: "pointer",
            padding: "10px 20px",
            borderRadius: "5px",
            backgroundColor: "#f0f0f0",
            boxShadow: "0 2px 4px rgba(0, 114, 32, 0.1)",
            transition: "background-color 0.3s, box-shadow 0.3s",
            "&:hover": {
              backgroundColor: "#e0e0e0",
              boxShadow: "0 4px 8px rgba(84, 84, 84, 0.2)",
            },
            display: "inline-block",
            textAlign: "center",
         }}>Home</Link>
        <Link to="/about" style={{ margin: "10px",
          fontSize: "24px",
          fontWeight: "bold",
          textDecoration: "none",
          color: "#0072e5",
          cursor: "pointer",
          padding: "10px 20px",
          borderRadius: "5px",
          backgroundColor: "#f0f0f0",
          boxShadow: "0 2px 4px rgba(0, 114, 32, 0.1)",
          transition: "background-color 0.3s, box-shadow 0.3s",
          "&:hover": {
            backgroundColor: "#e0e0e0",
            boxShadow: "0 4px 8px rgba(84, 84, 84, 0.2)",
          },
          display: "inline-block",
          textAlign: "center",
         }}>About</Link>
        <Link to="/contact" style={{ margin: "10px",
          fontSize: "24px",
          fontWeight: "bold",
          textDecoration: "none",
          color: "#0072e5",
          cursor: "pointer",
          padding: "10px 20px",
          borderRadius: "5px",
          backgroundColor: "#f0f0f0",
          boxShadow: "0 2px 4px rgba(0, 114, 32, 0.1)",
          transition: "background-color 0.3s, box-shadow 0.3s",
          "&:hover": {
            backgroundColor: "#e0e0e0",
            boxShadow: "0 4px 8px rgba(84, 84, 84, 0.2)",
          },
          display: "inline-block",
          textAlign: "center",
         }}>Contact</Link>
        <Link to="/LLM" style={{ margin: "10px",
          fontSize: "24px",
          fontWeight: "bold",
          textDecoration: "none",
          color: "#0072e5",
          cursor: "pointer",
          padding: "10px 20px",
          borderRadius: "5px",
          backgroundColor: "#f0f0f0",
          boxShadow: "0 2px 4px rgba(0, 114, 32, 0.1)",
          transition: "background-color 0.3s, box-shadow 0.3s",
          "&:hover": {
            backgroundColor: "#e0e0e0",
            boxShadow: "0 4px 8px rgba(84, 84, 84, 0.2)",
          },
          display: "inline-block",
          textAlign: "center",
         }}>LLM</Link>
        <Link to="/dashboard" style={{ margin: "10px",
          fontSize: "24px",
          fontWeight: "bold",
          textDecoration: "none",
          color: "#0072e5",
          cursor: "pointer",
          padding: "10px 20px",
          borderRadius: "5px",
          backgroundColor: "#f0f0f0",
          boxShadow: "0 2px 4px rgba(0, 114, 32, 0.1)",
          transition: "background-color 0.3s, box-shadow 0.3s",
          "&:hover": {
            backgroundColor: "#e0e0e0",
            boxShadow: "0 4px 8px rgba(84, 84, 84, 0.2)",
          },
          display: "inline-block",
          textAlign: "center",
         }}>Dashboard</Link>
        <Link to="/gamespage" style={{ margin: "10px",
          fontSize: "24px",
          fontWeight: "bold",
          textDecoration: "none",
          color: "#0072e5",
          cursor: "pointer",
          padding: "10px 20px",
          borderRadius: "5px",
          backgroundColor: "#f0f0f0",
          boxShadow: "0 2px 4px rgba(0, 114, 32, 0.1)",
          transition: "background-color 0.3s, box-shadow 0.3s",
          "&:hover": {
            backgroundColor: "#e0e0e0",
            boxShadow: "0 4px 8px rgba(84, 84, 84, 0.2)",
          },
          display: "inline-block",
          textAlign: "center",
         }}>Games</Link>
        <Link to="/reading-mode" style={{ margin: "10px",
          fontSize: "24px",
          fontWeight: "bold",
          textDecoration: "none",
          color: "#0072e5",
          cursor: "pointer",
          padding: "10px 20px",
          borderRadius: "5px",
          backgroundColor: "#f0f0f0",
          boxShadow: "0 2px 4px rgba(0, 114, 32, 0.1)",
          transition: "background-color 0.3s, box-shadow 0.3s",
          "&:hover": {
            backgroundColor: "#e0e0e0",
            boxShadow: "0 4px 8px rgba(84, 84, 84, 0.2)",
          },
          display: "inline-block",
          textAlign: "center",
         }}>Reading Mode</Link>
      </nav>
      )}

      {/* Routes Handling */}
      <div style={{ textAlign: "center", marginTop: hideHeaderNav ? "0" : "20px" }}>
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/About" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/LLM" element={<ChatPage />} />
          <Route path="/gamespage" element={<GamesPage />} />

          {/* Authentication Pages */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Protected Pages (Only accessible if logged in) */}
          <Route element={<PrivateOutlet />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/reading-mode" element={<ReadingModePage />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </>
  );
}

// ============================
// Main App Component (Wraps Everything)
// ============================
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;