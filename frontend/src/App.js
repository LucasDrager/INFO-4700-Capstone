import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import AboutPage from "./Pages/AboutPage";
import ContactPage from "./Pages/ContactPage";
import ChatPage from "./Pages/chatPage";
import Header from "./components/Header";  // Common header for all pages

function App() { // This is what will render on every single page
  return (
    <Router>
      <Header /> {/* Global header */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <nav>
          <Link to="/" style={{ margin: "10px" }}>Home</Link>
          <Link to="/about" style={{ margin: "10px" }}>About</Link>
          <Link to="/contact" style={{ margin: "10px" }}>Contact</Link>
          <Link to="/LLM" style={{ margin: "10px" }}>LLM</Link>
        </nav>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/LLM" element={<ChatPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
