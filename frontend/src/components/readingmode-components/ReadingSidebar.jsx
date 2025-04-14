import React, { useState, useEffect } from 'react';

const SidebarDashboard = ({ interactiveTextRef, notes, onAddNote, onDeleteNote, onUpdateNote }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleStickyNoteChange = (id, event) => {
    // Use the shared note update handler
    onUpdateNote(id, event.target.value);
  };

  const handleAddStickyNote = (initialText = 'Sticky Note') => {
    // Use the shared note add handler
    onAddNote(initialText, '');
  };

  const handleDeleteStickyNote = (id) => {
    // Use the shared note delete handler
    onDeleteNote(id);
  };

  const handleTextHighlight = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      const selectedText = selection.toString();
      handleAddStickyNote(selectedText);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredNotes = notes ? notes.filter(note =>
    note.text.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  // This effect is no longer needed since we're using the shared notes system
  // and text selection is handled by ReadingContainer

  return (
    <div 
      className={`sidebar-dashboard ${isCollapsed ? 'collapsed' : ''}`}
      style={{
        position: 'fixed',
        right: 0, 
        top: 0,
        height: '100%',
        width: isCollapsed ? '0px' : '300px',
        backgroundColor: isCollapsed ? 'transparent' : '#e6f4ea',
        transition: 'width 0.3s ease, background-color 0.3s ease',
        overflow: 'hidden',
        zIndex: 1000,
        borderLeft: isCollapsed ? 'none' : '2px solid #ccc',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {!isCollapsed && (
        <div style={{ padding: '10px', width: '90%' }}>
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={handleSearchChange}
            style={{
              width: '100%',
              padding: '8px',
              marginBottom: '10px',
              borderRadius: '5px',
              border: '1px solid #ccc'
            }}
          />
        </div>
      )}

      <div 
        className="sidebar-dashboardContainer" 
        style={{ 
          width: '100%', 
          height: '100%', 
          overflowY: 'auto',
        }}
      >
        {!isCollapsed && filteredNotes.map(note => (
          <div 
            key={note.id}
            className="sticky-note" 
            style={{
              position: 'relative',
              backgroundColor: '#84c59b',
              padding: '15px',
              margin: '10px auto', 
              borderRadius: '8px',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
              width: '90%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              color: '#fff',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
              <textarea
                value={note.text}
                onChange={(event) => handleStickyNoteChange(note.id, event)}
                style={{
                  width: '100%',
                  height: '70px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  resize: 'none',
                  textAlign: 'left',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  color: '#fff',
                  marginBottom: '5px',
                }}
              />
              {note.comment && (
                <div style={{
                  fontSize: '12px',
                  color: '#ffffffcc',
                  textAlign: 'left',
                  borderTop: '1px solid #ffffff33',
                  paddingTop: '5px',
                  fontStyle: 'italic'
                }}>
                  {note.comment}
                </div>
              )}
            </div>
            <button 
              onClick={() => handleDeleteStickyNote(note.id)}
              style={{
                position: 'absolute',
                top: '5px',
                right: '5px',
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: '16px',
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              &minus;
            </button>
          </div>
        ))}

        {!isCollapsed && (
          <button 
            onClick={() => handleAddStickyNote()} 
            style={{
              margin: '15px auto',
              padding: '10px 20px',
              fontSize: '16px',
              cursor: 'pointer',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              display: 'block',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
              fontWeight: 'bold',
              transition: 'all 0.2s ease'
            }}
          >
            Add Sticky Note
          </button>
        )}
      </div>

      <div 
        className="sidebar-tab" 
        onClick={handleCollapse} 
        style={{ cursor: 'pointer', padding: '17px' }} 
      >
        <div>
          <div 
            style={{
              fontSize: '24px', 
              fontWeight: 'bold',
            }}
          >
            {isCollapsed ? '+' : '-'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarDashboard;






