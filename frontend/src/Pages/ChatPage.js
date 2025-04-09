import React, { useState } from 'react';
import './ChatPage.css'; // Add a CSS file for styling

function ChatPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <div
        className={`sidebar ${isSidebarOpen ? 'open' : ''}`}
        style={{
          width: isSidebarOpen ? '300px' : '0',
          transition: 'width 0.3s',
          overflow: 'hidden',
          backgroundColor: '#f4f4f4',
          boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
        }}
      >
        <button onClick={toggleSidebar} style={{ margin: '10px' }}>
          {isSidebarOpen ? 'Close' : 'Open'} Sidebar
        </button>
        <iframe
          src="http://localhost:8080"
          title="Open WebUI Chat"
          style={{ width: '100%', height: 'calc(100% - 40px)', border: 'none' }}
        />
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '20px' }}>
        <button onClick={toggleSidebar} style={{ marginBottom: '10px' }}>
          {isSidebarOpen ? 'Hide' : 'Show'} WebUI
        </button>
        <h1>Welcome to the Chat Page</h1>
        <p>Here is the main content of the page.</p>
      </div>
    </div>
  );
}

export default ChatPage;