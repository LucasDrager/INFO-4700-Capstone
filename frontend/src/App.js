import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth, AuthProvider } from './AuthContext.js';

// Import Components
import Header from "./components/Header"; 

// Import Public Pages
import HomePage from "./Pages/HomePage";
import AboutPage from "./Pages/AboutPage";
import ContactPage from "./Pages/AboutPage";
import ChatPage from "./Pages/ChatPage";
import GamesPage from "./Pages/GamesPage";
import ReadingMode from "./Pages/ReadingMode";

// Import Protected Pages
import Dashboard from "./Pages/Dashboard";
import Settings from "./Pages/Settings";

// Import Authentication Pages
import LoginPage from "./Pages/LoginPage.js";
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

  // any path in this list will have the navbar hidden (with set hideHeadernav to TRUE)
  const hideHeaderNav = ["/dashboard", "/settings", "/gamespage", "/readingmode"].includes(location.pathname);


  return (
    <>
      {/* Conditionally display the header */}
      {!hideHeaderNav && <Header />}

      {/* Conditionally display the navigation bar */}
      {!hideHeaderNav && (
        <nav style={{ marginTop: "20px", textAlign: "center" }}>
          <Link to="/" style={{ margin: "10px" }}>Home</Link>
          <Link to="/about" style={{ margin: "10px" }}>About</Link>
          <Link to="/contact" style={{ margin: "10px" }}>Contact</Link>
          <Link to="/LLM" style={{ margin: "10px" }}>LLM</Link>
          <Link to="/dashboard" style={{ margin: "10px" }}>Dashboard</Link>
          <Link to="/gamespage" style={{ margin: "10px" }}>Games</Link>
          <Link to="/readingmode" style={{ margin: "10px" }}>ReadingMode</Link>
        </nav>
      )}

      {/* Routes Handling */}
      <div style={{ textAlign: "center", marginTop: hideHeaderNav ? "0" : "20px" }}>
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
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
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/readingmode" element={<ReadingMode />} />
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