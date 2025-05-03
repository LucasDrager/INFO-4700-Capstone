import React, { useState, useEffect, useRef } from 'react';
import ReadingModeAnnotator from './ReadingModeAnnotator';
const API_BASE = process.env.REACT_APP_API_BASE;

// Constants for header height and positioning
const HEADER_HEIGHT = 0; // Approximate header height in pixels

const SidebarDashboard = ({
  interactiveTextRef,
  notes,
  onAddNote,
  onDeleteNote,
  onUpdateNote,
  pdfText,
  currentPage,
  onPageClick,
  attachToNavbar = true // New prop to control whether sidebar attaches to navbar
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState('stickyNotes');
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startDragPosition, setStartDragPosition] = useState({ x: 0, y: 0 });
  const [width, setWidth] = useState(300);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef(null);
  const resizeHandleRef = useRef(null);

  const handleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Handle the start of dragging the sidebar
  const handleDragStart = (e) => {
    if (e.target === resizeHandleRef.current || attachToNavbar) return; // Prevent dragging when attached to navbar

    setIsDragging(true);
    setStartDragPosition({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  // Handle dragging the sidebar
  const handleDrag = (e) => {
    if (isDragging) {
      const newX = e.clientX - startDragPosition.x;
      const newY = e.clientY - startDragPosition.y;
      setPosition({ x: newX, y: newY });
    }
  };

  // Handle the end of dragging
  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Handle the start of resizing
  const handleResizeStart = (e) => {
    e.stopPropagation();
    setIsResizing(true);
  };

  // Handle resizing the sidebar
  const handleResize = (e) => {
    if (isResizing && !isCollapsed) {
      // Calculate new width based on the mouse position
      const newWidth = e.clientX - position.x;
      // More responsive limits - at least 150px, at most 90% of viewport width
      const maxWidth = Math.min(800, window.innerWidth * 0.9);
      if (newWidth >= 150 && newWidth <= maxWidth) {
        setWidth(newWidth);
      }
    }
  };

  // Handle the end of resizing
  const handleResizeEnd = () => {
    setIsResizing(false);
  };

  // Add and remove event listeners for dragging and resizing
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) handleDrag(e);
      if (isResizing) handleResize(e);
    };

    const handleMouseUp = () => {
      handleDragEnd();
      handleResizeEnd();
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, position, startDragPosition]);

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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredNotes = notes ? notes.filter(note =>
    note.text.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  // Calculate responsive dimensions
  const calculateResponsiveHeight = () => {
    const viewportHeight = window.innerHeight;
    return Math.min(Math.max(viewportHeight * 0.8, 400), viewportHeight - 40); // Between 400px and viewport - 40px
  };

  // Update dimensions on window resize
  useEffect(() => {
    const handleResize = () => {
      // Reset width if it's too large for current viewport
      if (width > window.innerWidth * 0.9) {
        setWidth(Math.max(300, window.innerWidth * 0.3));
      }
      // Reset position if sidebar is off-screen
      const rightEdge = position.x + width;
      const bottomEdge = position.y + calculateResponsiveHeight();

      if (rightEdge > window.innerWidth || position.x < 0) {
        setPosition(prev => ({ ...prev, x: Math.max(0, window.innerWidth - width - 20) }));
      }

      if (bottomEdge > window.innerHeight || position.y < 0) {
        setPosition(prev => ({ ...prev, y: Math.max(0, window.innerHeight - calculateResponsiveHeight() - 20) }));
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [width, position]);

  // Handle adjusting position when attached to navbar
  useEffect(() => {
    if (attachToNavbar) {
      setPosition({ x: 0, y: HEADER_HEIGHT });
    }
  }, [attachToNavbar]);

  return (
    <div
      ref={sidebarRef}
      className={`sidebar-dashboard ${isCollapsed ? 'collapsed' : ''} ${isDragging ? 'dragging' : ''} ${attachToNavbar ? 'attached' : ''}`}
      style={{
        position: 'fixed',
        left: attachToNavbar ? 0 : position.x,
        top: attachToNavbar ? HEADER_HEIGHT : position.y,
        height: attachToNavbar ? `calc(100vh - ${HEADER_HEIGHT}px)` : `${calculateResponsiveHeight()}px`,
        width: isCollapsed ? '65px' : `${width}px`,
        backgroundColor: '#f0f9f2',
        transition: isDragging || isResizing ? 'none' : 'width 0.3s ease, box-shadow 0.3s ease',
        overflow: 'hidden',
        zIndex: 1000,
        border: attachToNavbar ? '0 1px 1px 0 #c8e6d0' : '1px solid #c8e6d0',
        borderRadius: attachToNavbar ? '0 12px 12px 0' : '12px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: attachToNavbar ? '2px 4px 8px rgba(0,0,0,0.06)' : '0 6px 12px rgba(0,0,0,0.08)',
        cursor: isDragging ? 'grabbing' : 'auto',
        maxWidth: '90vw',
        maxHeight: attachToNavbar ? '100%' : '90vh',
        paddingBottom: '0' // Remove bottom padding
      }}
    >
      {/* Drag handle at the top */}
      {/* Removed green bar for cleaner look */}
      <a type="button" class="btn btn-secondary" href='/dashboard'>Home</a>
      <div style={{
        padding: isCollapsed ? '10px 0' : '10px',
        width: '100%',
        display: 'flex',
        flexDirection: isCollapsed ? 'column' : 'row',
        justifyContent: isCollapsed ? 'center' : 'space-around',
        gap: '20px',
        alignItems: 'center',
        marginBottom: '10px'
      }}>
        <button
          onClick={() => setView('stickyNotes')}
          title="Sticky Notes"
          style={{
            backgroundColor: view === 'stickyNotes' ? '#84c59b' : '#f3f3f3',
            border: '2px solid ' + (view === 'stickyNotes' ? '#4caf50' : '#ddd'),
            borderRadius: '50%',
            cursor: 'pointer',
            width: '45px',
            height: '45px',
            backgroundImage: 'url(/Sticky-Note-Icon.png)',
            backgroundSize: '70%',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            boxShadow: view === 'stickyNotes' ? '0 2px 5px rgba(0,0,0,0.2)' : 'none',
            transition: 'all 0.2s ease',
            margin: isCollapsed ? '8px 0' : '0'
          }}
        />
        <button
          onClick={() => setView('readingAnnotator')}
          title="Reading Annotator"
          style={{
            backgroundColor: view === 'readingAnnotator' ? '#84c59b' : '#f3f3f3',
            border: '2px solid ' + (view === 'readingAnnotator' ? '#4caf50' : '#ddd'),
            borderRadius: '50%',
            cursor: 'pointer',
            width: '45px',
            height: '45px',
            backgroundImage: 'url(/annotation-icon.svg)',
            backgroundSize: '70%',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            boxShadow: view === 'readingAnnotator' ? '0 2px 5px rgba(0,0,0,0.2)' : 'none',
            transition: 'all 0.2s ease',
            margin: isCollapsed ? '8px 0' : '0'
          }}
        />
        <button
          onClick={() => setView('webInterface')}
          title="Web Interface"
          style={{
            backgroundColor: view === 'webInterface' ? '#84c59b' : '#f3f3f3',
            border: '2px solid ' + (view === 'webInterface' ? '#4caf50' : '#ddd'),
            borderRadius: '50%',
            cursor: 'pointer',
            width: '45px',
            height: '45px',
            backgroundImage: 'url(/Reading-Helper-AI-Icon.png)',
            backgroundSize: '70%',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            boxShadow: view === 'webInterface' ? '0 2px 5px rgba(0,0,0,0.2)' : 'none',
            transition: 'all 0.2s ease',
            margin: isCollapsed ? '8px 0' : '0'
          }}
        />
      </div>

      <div
        className="sidebar-dashboardContainer"
        style={{
          width: '100%',
          height: 'calc(100% - 100px)',
          overflowY: 'auto',
          overflowX: 'hidden',
          display: isCollapsed ? 'none' : 'block',
          padding: '0 8px',
          marginTop: '5px'
        }}
      >
        {view === 'stickyNotes' && filteredNotes.map(note => (
          <div
            key={note.id}
            className="sticky-note"
            style={{
              position: 'relative',
              backgroundColor: '#a8e6b5',
              padding: '15px',
              margin: '15px auto',
              borderRadius: '10px',
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

        {view === 'stickyNotes' && (
          <button
            onClick={() => handleAddStickyNote()}
            style={{
              margin: '20px auto',
              padding: '12px 25px',
              fontSize: '16px',
              cursor: 'pointer',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              display: 'block',
              boxShadow: '0 3px 6px rgba(0, 0, 0, 0.15)',
              fontWeight: 'bold',
              transition: 'all 0.2s ease',
              letterSpacing: '0.5px'
            }}
          >
            Add Sticky Note
          </button>
        )}

        {view === 'readingAnnotator' && (
          <div style={{ height: '100%', width: '100%', overflow: 'hidden' }}>
            <ReadingModeAnnotator
              interactiveTextRef={interactiveTextRef}
              pdfText={pdfText}
              currentPage={currentPage}
              onPageClick={onPageClick}
              notes={notes}
              onAddNote={onAddNote}
              onDeleteNote={onDeleteNote}
              onUpdateNote={onUpdateNote}
            />
          </div>
        )}

        {view === 'webInterface' && (
          <iframe
            src="http://localhost:8080"
            title="Reading Assistant"
            style={{
              width: '100%',
              height: 'calc(100% - 5px)',
              border: 'none',
              marginTop: '5px',
            }}
          />
        )}
      </div>

      {/* Resize button */}
      {!isCollapsed && (
        <div
          ref={resizeHandleRef}
          className="sidebar-resize-handle"
          onMouseDown={handleResizeStart}
          style={{
            cursor: 'ew-resize',
            position: 'absolute',
            top: '40%',
            right: '-3px',
            transform: 'translateY(-50%)',
            backgroundColor: '#4caf50',
            borderRadius: '4px 0 0 4px',
            width: '12px',
            height: '60px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: '-1px 0 3px rgba(0,0,0,0.1)',
            zIndex: 15
          }}
        >
          <div style={{
            fontSize: '12px',
            color: 'white',
            fontWeight: 'bold',
            transform: 'rotate(90deg)',
            letterSpacing: '2px',
            userSelect: 'none'
          }}>
            ≡≡
          </div>
        </div>
      )}

      {/* Collapse button */}
      <div
        className="sidebar-tab"
        onClick={handleCollapse}
        style={{
          cursor: 'pointer',
          padding: '8px',
          position: 'absolute',
          bottom: isCollapsed ? '50%' : '20px', // Center vertically when collapsed
          left: isCollapsed ? '18px' : '25px', // Shift to left when collapsed to be more visible
          right: isCollapsed ? undefined : undefined,
          transform: isCollapsed ? 'translateY(50%)' : 'none', // Adjust for perfect centering
          backgroundColor: '#4caf50',
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '36px',
          height: '36px',
          color: '#fff',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          border: '2px solid #fff',
          zIndex: 20
        }}
      >
        <div
          style={{
            fontSize: isCollapsed ? '24px' : '18px',
            fontWeight: 'bold',
            lineHeight: 1,
            color: '#ffffff',
            textShadow: '0px 1px 2px rgba(0,0,0,0.3)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%'
          }}
        >
          {isCollapsed ? '>' : '<'}
        </div>
      </div>

      {/* Reset position button - only show when not attached to navbar */}
      {!attachToNavbar && (
        <div
          className="sidebar-reset-position"
          onClick={() => setPosition({ x: 0, y: 0 })}
          style={{
            cursor: 'pointer',
            padding: '8px',
            position: 'absolute',
            bottom: '70px',
            left: isCollapsed ? '10px' : '20px',
            backgroundColor: '#4caf50',
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '30px',
            height: '30px',
            color: '#fff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            fontSize: '16px',
            zIndex: 20
          }}
        >
          ⌂
        </div>
      )}
    </div>
  );
};

export default SidebarDashboard;

