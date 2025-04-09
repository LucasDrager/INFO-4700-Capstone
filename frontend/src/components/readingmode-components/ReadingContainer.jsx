import React, { useState, useEffect } from 'react';
import ReadingModeAnnotator from './ReadingModeAnnotator';

function ReadingContainer({ isSidebarCollapsed, onTextExtraction, currentPage, onPageChange, pdfText, notes, onAddNote, onDeleteNote, onUpdateNote, interactiveTextRef }) {
  const [annotationPanelVisible, setAnnotationPanelVisible] = useState(false);
  const [files, setFiles] = useState([]);
  const [parsedText, setParsedText] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState('text'); // 'text' or 'pdf'
  const [timer, setTimer] = useState(0); // Timer for tracking reading time
  const [timerRunning, setTimerRunning] = useState(false); // To control timer's state
  const sidebarWidth = isSidebarCollapsed ? '40px' : '300px';

  useEffect(() => {
    let interval;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimer((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [timerRunning]);

  const handleFileUpload = async (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (selectedFiles.length === 0) return;

    const newFiles = selectedFiles.map(file => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));

    setFiles(newFiles);

    const formData = new FormData();
    selectedFiles.forEach(file => formData.append('pdf_files', file));

    setIsLoading(true);
    setTimer(0); // Reset timer when new file is uploaded
    setTimerRunning(true); // Start the timer as soon as a file is uploaded

    try {
      const response = await fetch('http://localhost:8000/api/parse-pdf/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error processing PDF file');
      }

      const texts = data.texts || [];
      setParsedText(texts);
      
      // Pass extracted text to parent component
      if (onTextExtraction) {
        onTextExtraction(texts);
      }
      
      // Start timer when text is extracted
      setTimerRunning(true);
    } catch (error) {
      console.error('Error uploading PDF:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div
      className="FE-WidgetContainer"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: `calc(100vw - ${sidebarWidth})`,
        marginLeft: sidebarWidth,
        transition: 'width 0.3s ease, margin-left 0.3s ease',
        backgroundColor: '#f4f4f4',
      }}
    >
      <div
        className="FE-InnerContainer"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#ffffff',
          padding: '30px',
          borderRadius: '10px',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          width: '90%',
          maxWidth: '1000px',
          height: '95vh',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Reading Timer and Controls Panel */}
        <div
          className="controls-panel"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '15px',
            position: 'absolute',
            top: '10px',
            left: '0',
            right: '0',
            zIndex: 10
          }}
        >
          {/* Reading Timer */}
          <div
            className="reading-timer"
            style={{
              backgroundColor: '#a5d6a7',
              color: '#333',
              fontWeight: 'bold',
              padding: '6px 12px',
              borderRadius: '5px',
              fontSize: '14px',
              opacity: 0.8,
              textAlign: 'center',
            }}
          >
            {formatTime(timer)}
          </div>
          
          {/* Mode Controls */}
          {files.length > 0 && parsedText.length > 0 && (
            <div className="mode-controls" style={{ display: 'flex', gap: '10px' }}>
              {/* View Mode Toggle */}
              <button
                onClick={() => {
                  const newViewMode = viewMode === 'text' ? 'pdf' : 'text';
                  setViewMode(newViewMode);
                  
                  // Notify parent component about view mode change
                  if (onPageChange) {
                    onPageChange(currentPage, newViewMode);
                  }
                }}
                style={{
                  backgroundColor: '#a5d6a7',
                  color: '#333',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  opacity: 0.8,
                  transition: 'opacity 0.3s, background-color 0.3s',
                }}
              >
                {viewMode === 'text' ? 'PDF View' : 'Text View'}
              </button>
              
              {/* Annotation Panel Toggle Button */}
              {viewMode === 'text' && (
                <button
                  onClick={() => setAnnotationPanelVisible(!annotationPanelVisible)}
                  style={{
                    backgroundColor: annotationPanelVisible ? '#f44336' : '#4caf50',
                    color: 'white',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    opacity: 0.8,
                    transition: 'opacity 0.3s, background-color 0.3s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span style={{ fontSize: '16px' }}>
                    {annotationPanelVisible ? '✕' : '✎'}
                  </span>
                  {annotationPanelVisible ? 'Close' : 'Annotate'}
                </button>
              )}
            </div>
          )}
        </div>

        {/* File Upload Section */}
        {!files.length && (
          <>
            <h2 style={{ marginBottom: '20px' }}>Reading Mode</h2>
            <input
              type="file"
              accept=".pdf"
              multiple={false}
              onChange={handleFileUpload}
              className="form-control"
              style={{ maxWidth: '300px' }}
            />
          </>
        )}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="mt-3">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {/* Interactive Text View with slide-out annotation panel */}
        {viewMode === 'text' && parsedText.length > 0 && (
          <div className="interactive-text-container" style={{ position: 'relative', width: '100%', height: '100%' }}>
            <div
              ref={interactiveTextRef}
              className="interactive-text"
              onClick={() => onPageChange && onPageChange(currentPage + 1)}
              onMouseUp={(e) => {
                // Capture text selection and inform the annotation panel
                const selection = window.getSelection();
                const selectedText = selection.toString().trim();
                // Store the selection in a data attribute that ReadingModeAnnotator can access
                if (selectedText) {
                  document.getElementById('selected-text-container').textContent = selectedText;
                  // Trigger a custom event that ReadingModeAnnotator can listen for
                  const event = new CustomEvent('textSelected', { detail: selectedText });
                  document.dispatchEvent(event);
                }
              }}
              style={{
                width: '100%',
                height: '100%',
                overflowY: 'auto',
                textAlign: 'left',
                padding: '20px',
                whiteSpace: 'pre-wrap',
                fontFamily: 'Georgia, serif',
                fontSize: '16px',
                lineHeight: '1.6',
                color: '#333',
                backgroundColor: '#fdfdfd',
                borderRadius: '6px',
                boxShadow: 'inset 0 0 4px rgba(0, 0, 0, 0.05)',
                marginTop: '60px', // Add some margin to avoid overlap with the timer and button
              }}
            >
              {Array.isArray(parsedText) 
                ? parsedText.map((pageText, index) => (
                    <div key={index} style={{ marginBottom: '40px' }}>
                      <h4 style={{ marginBottom: '10px', color: '#555' }}>Page {index + 1}</h4>
                      <div>{pageText}</div>
                    </div>
                  ))
                : parsedText
              }
            </div>
            
            {/* Hidden container to store selected text */}
            <div id="selected-text-container" style={{ display: 'none' }}></div>
            
            {/* Slide-out Annotation Panel */}
            <div className="annotation-panel-overlay" 
              style={{
                position: 'absolute',
                top: '60px',
                bottom: '0',
                right: annotationPanelVisible ? '0' : '-350px',
                width: '350px', 
                backgroundColor: 'white',
                boxShadow: '-2px 0 10px rgba(0, 0, 0, 0.1)',
                transition: 'right 0.3s ease',
                overflow: 'auto',
                borderTopLeftRadius: '8px',
                borderBottomLeftRadius: '8px',
                zIndex: 10
              }}
            >
              {annotationPanelVisible && (
                <ReadingModeAnnotator 
                  pdfText={pdfText.length > 0 ? pdfText : parsedText} 
                  currentPage={currentPage}
                  onPageClick={onPageChange}
                  notes={notes}
                  onAddNote={onAddNote}
                  onDeleteNote={onDeleteNote}
                  onUpdateNote={onUpdateNote}
                />
              )}
            </div>
          </div>
        )}

        {/* PDF View */}
        {viewMode === 'pdf' && files.length > 0 && (
          <div className="pdf-embed" style={{ width: '100%', height: '100%', marginTop: '60px' }}>
            <iframe
              src={files[0].url}
              title={files[0].name}
              width="100%"
              height="100%"
              style={{ border: 'none' }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ReadingContainer;
