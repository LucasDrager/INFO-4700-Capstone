import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

//pages
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

const App = () => {
  return (
    <Router>
      <Header /> {/* Global header */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <nav>
          <Link to="/" style={{ margin: "10px" }}>Home</Link>
          <Link to="/about" style={{ margin: "10px" }}>About</Link>
          <Link to="/contact" style={{ margin: "10px" }}>Contact</Link>
          <Link to="/LLM" style={{ margin: "10px" }}>LLM</Link>
          <Link to="/Dashboard" style={{ margin: "10px" }}>Dashboard</Link>
          <Link to="/login" style={{ margin: "10px" }}>Login</Link>
        </nav>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/LLM" element={<ChatPage />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/Settings" element={<Settings />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
