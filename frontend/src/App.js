import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";

//WEBSITE pages
import HomePage from "./Pages/HomePage";
import AboutPage from "./Pages/AboutPage";
import ContactPage from "./Pages/ContactPage";
import ChatPage from "./Pages/chatPage";
import ReadingMode from "./Pages/ReadingMode";

//APP pages
import Settings from "./Pages/Settings";
import Dashboard from "./Pages/Dashboard";

//components 
import Header from "./components/Header";  // Common header for all pages

function AppContent() {

  //the use location hook first to find the current url path 
  const location = useLocation();

  // any path in this list will have the navbar hidden (with set hideHeadernav to TRUE)
  const hideHeaderNav = ["/dashboard", "/settings", "/gamespage", "/readingmode"].includes(location.pathname);


  return (
    <>
      {/* separated to make it so we can conditionally hide the nav bar*/}
      {!hideHeaderNav && <Header />}
      {!hideHeaderNav && (
        <nav style={{ marginTop: "20px", textAlign: "center" }}>
          <Link to="/" style={{ margin: "10px" }}>Home</Link>
          <Link to="/about" style={{ margin: "10px" }}>About</Link>
          <Link to="/contact" style={{ margin: "10px" }}>Contact</Link>
          <Link to="/LLM" style={{ margin: "10px" }}>LLM</Link>
          <Link to="/dashboard" style={{ margin: "10px" }}>Dashboard</Link>
          <Link to="/readingmode" style={{ margin: "10px" }}>ReadingMode</Link>
        </nav>
      )}

      {/* The Routes for your app */}
      {/* hideHeaderNav ? makes sure that there isnt a gap if we're on a page w/o the header*/}
      <div style={{ textAlign: "center", marginTop: hideHeaderNav ? "0" : "20px" }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/LLM" element={<ChatPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/readingmode" element={<ReadingMode />} />
        </Routes>
      </div>
    </>
  );
}
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}


export default App;
