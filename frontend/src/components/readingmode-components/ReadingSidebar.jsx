import React, { useState, useEffect } from 'react';

const SidebarDashboard = ({ interactiveTextRef }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [stickyNotes, setStickyNotes] = useState([{ id: 1, text: 'Sticky Note' }]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleStickyNoteChange = (id, event) => {
    const newStickyNotes = stickyNotes.map(note => {
      if (note.id === id) {
        return { ...note, text: event.target.value };
      }
      return note;
    });
    setStickyNotes(newStickyNotes);
  };

  const handleAddStickyNote = (initialText = 'Sticky Note') => {
    const newNote = {
      id: stickyNotes.length + 1,
      text: initialText,
    };
    setStickyNotes([...stickyNotes, newNote]);
  };

  const handleDeleteStickyNote = (id) => {
    const newStickyNotes = stickyNotes.filter(note => note.id !== id);
    setStickyNotes(newStickyNotes);
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

  const filteredNotes = stickyNotes.filter(note =>
    note.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const target = interactiveTextRef?.current;
    if (!target) return;

    const handleMouseUp = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim().length > 0) {
        handleAddStickyNote(selection.toString());
      }
    };

    target.addEventListener('mouseup', handleMouseUp);
    return () => target.removeEventListener('mouseup', handleMouseUp);
  }, [interactiveTextRef]);

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
              padding: '10px',
              margin: '10px auto', 
              borderRadius: '5px',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
              fontWeight: 'bold',
              width: '90%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#fff',
            }}
          >
            <textarea
              value={note.text}
              onChange={(event) => handleStickyNoteChange(note.id, event)}
              style={{
                width: '100%',
                height: '100px',
                border: 'none',
                backgroundColor: 'transparent',
                resize: 'none',
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: '16px',
                color: '#fff',
              }}
            />
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
              margin: '10px',
              padding: '10px 20px',
              fontSize: '16px',
              cursor: 'pointer',
              backgroundColor: '#84c59b',
              color: 'white',
              border: 'none',
              borderRadius: '6px'
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






