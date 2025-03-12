import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SidebarDashboard = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [stickyNotes, setStickyNotes] = useState([{ id: 1, text: 'Sticky Note' }]);

  // Handle sidebar collapse
  const handleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Handle sticky note text change
  const handleStickyNoteChange = (id, event) => {
    const newStickyNotes = stickyNotes.map(note => {
      if (note.id === id) {
        return { ...note, text: event.target.value };
      }
      return note;
    });
    setStickyNotes(newStickyNotes);
  };

  // Handle adding a new sticky note
  const handleAddStickyNote = () => {
    const newNote = { id: stickyNotes.length + 1, text: 'Sticky Note' };
    setStickyNotes([...stickyNotes, newNote]);
  };

  // Handle deleting a sticky note
  const handleDeleteStickyNote = (id) => {
    const newStickyNotes = stickyNotes.filter(note => note.id !== id);
    setStickyNotes(newStickyNotes);
  };

  return (
    <div 
      className={`sidebar-dashboard ${isCollapsed ? 'collapsed' : ''}`}
      style={{
        position: 'fixed',
        right: 0, 
        top: 0,
        height: '100%',
        width: isCollapsed ? '0px' : '300px',   
        backgroundColor: isCollapsed ? 'transparent' : '#f4f4f4', //  Hide background when collapsed
        transition: 'width 0.3s ease, background-color 0.3s ease',
        overflow: 'hidden',  //  Prevents content from showing when collapsed
        zIndex: 1000,
        borderLeft: isCollapsed ? 'none' : '2px solid #ccc', // Optional border to show sidebar
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', // Center items horizontally
      }}
    >
      <div 
        className="sidebar-dashboardContainer" 
        style={{ 
          width: '100%', 
          height: '100%', 
          overflowY: 'auto', // Enable vertical scrolling
        }}
      >
        {/* Sticky notes */}
        {!isCollapsed && stickyNotes.map(note => (
          <div 
            key={note.id}
            className="sticky-note" 
            style={{
              position: 'relative', // Required for positioning the delete button
              backgroundColor: '#ffeb3b',
              padding: '10px',
              margin: '10px auto', 
              borderRadius: '5px',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
              fontWeight: 'bold',
              width: '90%', // 
              display: 'flex',
              justifyContent: 'center', // Center content horizontally
              alignItems: 'center', // Center content vertically
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
                cursor: 'pointer',
              }}
            >
              &minus;
            </button>
          </div>
        ))}
        {/* Button to add a new sticky note */}
        {!isCollapsed && (
          <button 
            onClick={handleAddStickyNote} 
            style={{
              margin: '10px',
              padding: '10px 20px',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            Add Sticky Note
          </button>
        )}
      </div>
      {/* Button to collapse the sidebar */}
      <div 
        className="sidebar-tab" 
        onClick={handleCollapse} 
        style={{ cursor: 'pointer', padding: '17px' }} 
      >
        <div>
          {/* Collapse button icon */}
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