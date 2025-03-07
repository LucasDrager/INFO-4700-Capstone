import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

//WEBSITE pages
import HomePage from "./Pages/HomePage";
import AboutPage from "./Pages/AboutPage";
import ContactPage from "./Pages/ContactPage";
import ChatPage from "./Pages/chatPage";
import GamesPage from "./Pages/GamesPage";
import LoginPage from "./Pages/LoginPage";
//figma design pages
import Settings from "./Pages/Settings";
import Dashboard from "./Pages/Dashboard";

//components 
import Header from "./components/Header";  // Common header for all pages

import './NavBar.css'; // some css for the navbar

function AppContent() {
  const [hideHeaderNav] = useState(false);

  return (
    <>
      <Header /> {/* Global header */}
      <nav className="navbar">
        <Link to="/" style={{ margin: "10px" }}>Home</Link>
        <Link to="/about" style={{ margin: "10px" }}>About</Link>
        <Link to="/contact" style={{ margin: "10px" }}>Contact</Link>
        <Link to="/LLM" style={{ margin: "10px" }}>LLM</Link>
        <Link to="/Dashboard" style={{ margin: "10px" }}>Dashboard</Link>
        <Link to="/login" style={{ margin: "10px" }}>Login</Link>
        <Link to="/games" style={{ margin: "10px" }}>Games</Link>
      </nav>

      {/* The Routes for your app */}
      {/* hideHeaderNav makes sure that there isnt a gap if we're on a page w/o the header*/}
      <div style={{ textAlign: "center", marginTop: hideHeaderNav ? "0" : "20px" }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/LLM" element={<ChatPage />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/Settings" element={<Settings />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/games" element={<GamesPage />} />
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
