import {React, useEffect} from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth, AuthProvider } from './AuthContext.js';

// Import Components
import Header from "./components/Header";

// Import Public Pages
import HomePage from "./Pages/HomePage";
import AboutPage from "./Pages/AboutPage";
import ContactPage from "./Pages/ContactPage.js";
import GamesPage from "./Pages/GamesPage";
import Flashcard from "./Pages/Flashcard";
import PracticeTest from "./Pages/PracticeTest";
import ReadingMode from "./Pages/ReadingMode";

// Import Protected Pages
import ThemeProvider from './ThemeContext'; /* rory's settings button test: can a user toggle light dark mode? */
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
  const hideHeaderNav = ["/dashboard", "/settings", "/gamespage", "/GamesPage", "/reading-mode", "/flashcard", "/practice-test"].includes(location.pathname);

  return (
    <>
    <div className="app-wrapper">
    <div className="app-frame">
      {/* Conditionally display the header */}
      {!hideHeaderNav && <Header />}

      {/* Conditionally display the navigation bar */}
      {!hideHeaderNav && (
        <nav style={{ marginTop: "20px", textAlign: "center" }}>
        <Link to="/" style={{ margin: "10px" }}>Home</Link>
        <Link to="/about" style={{ margin: "10px" }}>About</Link>
        <Link to="/contact" style={{ margin: "10px" }}>Contact</Link>
        <Link to="/dashboard" style={{ margin: "10px" }}>Dashboard</Link>
        <Link to="/gamespage" style={{ margin: "10px" }}>Games</Link>
        <Link to="/reading-mode" style={{ margin: "10px" }}>Reading Mode</Link>
          <Link to="/readingmode" style={{ margin: "10px" }}>ReadingMode</Link>
      </nav>
      )}

      {/* Routes Handling */}
      <div style={{ textAlign: "center", marginTop: hideHeaderNav ? "0" : "20px" }}>
        <Routes location={location}>

            {/* Public Pages */}
            <Route path="/" element={<HomePage />} />
            <Route path="/About" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/gamespage" element={<GamesPage />} />
            <Route path="/flashcard" element={<Flashcard />} />

            {/* Authentication Pages */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* Protected Pages (Only accessible if logged in) */}
            < Route element={<PrivateOutlet />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/reading-mode" element={<ReadingModePage />} />
            </Route>

            {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/readingmode" element={<ReadingMode />} />
        </Routes>
      </div>
    </div>
    </div>
    </>
  );
}

// ============================
// Main App Component (Wraps Everything)
// ============================
function App() {
  useEffect(() => {
    const designWidth = 1440;
    const designHeight = 812;

    function updateDimensions() {
      // Calculate scale as the smaller ratio of current viewport vs. design dimensions.
      const scale = Math.min(window.innerWidth / designWidth, window.innerHeight / designHeight);

      // Update the CSS custom property for scale (if you use it elsewhere)
      document.documentElement.style.setProperty("--scale", scale);

      // Now compute the adjusted dimensions.
      const adjustedWidth = designWidth * scale;
      const adjustedHeight = designHeight * scale;

      // Update the .app-frame element to reflect these dimensions.
      const frame = document.querySelector(".app-frame");
      if (frame) {
        // Remove the transform so that the element's box model matches the visual size.
        frame.style.width = `${adjustedWidth}px`;
        frame.style.height = `${adjustedHeight}px`;
        // Center the frame in the viewport.
        frame.style.position = "absolute";
        frame.style.left = `${(window.innerWidth - adjustedWidth) / 2}px`;
        frame.style.top = `${(window.innerHeight - adjustedHeight) / 2}px`;
      }
      // For debugging, log the computed values.
      console.log("Scale:", scale, "Width:", adjustedWidth, "Height:", adjustedHeight);
    }

    window.addEventListener("resize", updateDimensions);
    updateDimensions();
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;