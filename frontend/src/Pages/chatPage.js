import React from 'react';

function ChatPage() {
  return (
    <div style={{ height: '100vh', border: 'none' }}>
      <iframe
        src="http://localhost:8080"
        title="Open WebUI Chat"
        style={{ width: '100%', height: '100%', border: 'none' }}
      />
    </div>
  );
}

export default ChatPage;
