import {React, useEffect, useRef} from "react";
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
  const frameRef = useRef(null);

  useEffect(() => {
    function updateScale() {
      const frame = frameRef.current;
      if (!frame) return;

      // 1) Clear any previous transform so we measure real size
      frame.style.transform = "none";

      // 2) Measure the frame’s natural dimensions
      const { width: naturalW, height: naturalH } = frame.getBoundingClientRect();

      // 3) Compute uniform scale that fits both axes
      const scale = Math.min(
        window.innerWidth  / naturalW,
        window.innerHeight / naturalH
      );

      // 4) Apply natural size as container dimensions
      frame.style.width  = `${naturalW}px`;
      frame.style.height = `${naturalH}px`;
      frame.style.position = "absolute";

      // 5) Center the frame based on the *scaled* size
      const scaledW = naturalW * scale;
      const scaledH = naturalH * scale;
      frame.style.left = `${(window.innerWidth  - scaledW) / 2}px`;
      frame.style.top  = `${(window.innerHeight - scaledH) / 2}px`;

      // 6) Finally scale it
      frame.style.transform       = `scale(${scale})`;
      frame.style.transformOrigin = "top left";

      console.log("Scale:", scale, "natural:", naturalW, naturalH, "scaled:", scaledW, scaledH);
    }

    window.addEventListener("resize", updateScale);
    updateScale();
    return () => window.removeEventListener("resize", updateScale);
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