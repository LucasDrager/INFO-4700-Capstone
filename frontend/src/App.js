import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

//pages
import HomePage from "./Pages/HomePage";
import AboutPage from "./Pages/AboutPage";
import ContactPage from "./Pages/ContactPage";
import ChatPage from "./Pages/chatPage";
import GamesPage from "./Pages/GamesPage";
//figma design pages
import Settings from "./Pages/Settings";
import Dashboard from "./Pages/Dashboard";
//components 
import Header from "./components/Header";

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>
      <div className="layout-container">
        <Header /> {/* Global header */}
        
        {/* Toggle Button */}
        <button 
          className="sidebar-toggle"
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? '◀ Hide Menu' : '▶ Show Menu'}
        </button>

        {/* Empty Sidebar */}
        <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
          {/* Empty for now */}
        </div>

        {/* Main Content */}
        <div className={`main-content ${isSidebarOpen ? 'shifted' : ''}`}>
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <nav>
              <Link to="/" style={{ margin: "10px" }}>Home</Link>
              <Link to="/about" style={{ margin: "10px" }}>About</Link>
              <Link to="/Games" style={{ margin: "10px" }}>Games</Link>
              <Link to="/contact" style={{ margin: "10px" }}>Contact</Link>
              <Link to="/LLM" style={{ margin: "10px" }}>LLM</Link>
              <Link to="/Dashboard" style={{ margin: "10px" }}>Dashboard</Link>
            </nav>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/Games" element={<GamesPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/LLM" element={<ChatPage />} />
              <Route path="/Dashboard" element={<Dashboard />} />
              <Route path="/Settings" element={<Settings />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
