import React, { useState, useEffect } from 'react';
import ReadingModeAnnotator from './ReadingModeAnnotator';

function ReadingContainer({ isSidebarCollapsed, onTextExtraction, currentPage, onPageChange, pdfText, notes, onAddNote, onDeleteNote, onUpdateNote, interactiveTextRef }) {
  const [annotationPanelVisible, setAnnotationPanelVisible] = useState(false);
  const [files, setFiles] = useState([]);
  const [parsedText, setParsedText] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState('text');
  const [timer, setTimer] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const sidebarWidth = isSidebarCollapsed ? '40px' : '300px';

  useEffect(() => {
    const savedTime = localStorage.getItem('totalReadingTime');
    if (savedTime) {
      setTimer(parseInt(savedTime, 10));
    }
  }, []);

  useEffect(() => {
    let interval;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimer((prevTime) => {
          const newTime = prevTime + 1;
          localStorage.setItem('totalReadingTime', newTime);
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fileUrl = params.get('fileUrl');

    console.log('File URL from query params:', fileUrl);
  
    if (fileUrl) {
      // This fetches the PDF file as a Blob from your Django server
      fetch(fileUrl)
        .then(response => response.blob())
        .then(blob => {
          // Convert Blob to a File so we can send it as multipart/form-data
          const pdfFile = new File([blob], 'myFile.pdf', { type: 'application/pdf' });
          handleFileUpload(pdfFile);
        })
        .catch(err => console.error('Error fetching file from fileUrl', err));
    }
  }, []);  

  const handleFileUpload = async (input) => {
    let selectedFiles = [];
  
    // 1. If `input` is an Event from <input type="file" />,
    //    we'll pull files from input.target.files
    if (input?.target?.files) {
      selectedFiles = Array.from(input.target.files);
    }
    // 2. Else, if `input` is already a single File
    //    (like from your "fetch-then-new File()" flow),
    //    just push that file directly
    else if (input instanceof File) {
      selectedFiles.push(input);
    } 
    // 3. Otherwise, bail out
    else {
      console.error("handleFileUpload called with unknown input:", input);
      return;
    }
  
    if (selectedFiles.length === 0) return;
    const newFiles = selectedFiles.map(file => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));

    setFiles(newFiles);
  
    const formData = new FormData();
    selectedFiles.forEach(file => formData.append("pdf_files", file));
  
    setIsLoading(true);
    setTimerRunning(true);
  
    try {
      const response = await fetch("http://localhost:8000/api/parse-pdf/", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Error processing PDF file");
      }
  
      const texts = data.texts || [];
      setParsedText(texts);
  
      if (onTextExtraction) {
        onTextExtraction(texts);
      }
  
      setTimerRunning(true);
    } catch (error) {
      console.error("Error uploading PDF:", error);
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
        paddingLeft: '10px', // Slight adjustment to move content left
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
          padding: '20px', // Reduced padding
          borderRadius: '10px',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          width: '95%', // Increased width
          maxWidth: '1200px', // Increased max width
          height: '96vh', // Slightly taller
          overflow: 'hidden',
          position: 'relative',
          margin: '0 auto', // Better centering
        }}
      >
        {/* Controls Panel */}
        <div
          className="controls-panel"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '15px',
            position: 'absolute',
            top: '8px', // Moved up slightly
            left: '0',
            right: '0',
            zIndex: 10
          }}
        >
          {/* Reading Timer with Jackson improvements */}
          <div
            className="reading-timer"
            style={{
              backgroundColor: '#a5d6a7',
              color: '#333',
              fontWeight: 'bold',
              padding: '6px 12px',
              borderRadius: '5px',
              fontSize: '14px',
              opacity: 0.7,
              transition: 'opacity 0.3s, background-color 0.3s',
              textAlign: 'center',
              cursor: 'default',
            }}
            onMouseEnter={(e) => {
              e.target.style.opacity = 1;
              e.target.style.backgroundColor = '#81c784';
            }}
            onMouseLeave={(e) => {
              e.target.style.opacity = 0.7;
              e.target.style.backgroundColor = '#a5d6a7';
            }}
          >
            {formatTime(timer)}
          </div>

          {/* Mode Controls */}
          {files.length > 0 && parsedText.length > 0 && (
            <div className="mode-controls" style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => {
                  const newViewMode = viewMode === 'text' ? 'pdf' : 'text';
                  setViewMode(newViewMode);
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

        {isLoading && (
          <div className="mt-3">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {/* Interactive Text View with Annotation Panel */}
        {viewMode === 'text' && parsedText.length > 0 && (
          <div className="interactive-text-container" style={{ position: 'relative', width: '100%', height: '100%', maxWidth: '100%' }}>
            <div
              ref={interactiveTextRef}
              className="interactive-text"
              onClick={() => onPageChange && onPageChange(currentPage + 1)}
              onMouseUp={(e) => {
                const selection = window.getSelection();
                const selectedText = selection.toString().trim();
                if (selectedText) {
                  document.getElementById('selected-text-container').textContent = selectedText;
                  const event = new CustomEvent('textSelected', { detail: selectedText });
                  document.dispatchEvent(event);
                }
              }}
              style={{
                width: '100%',
                height: '100%',
                overflowY: 'auto',
                textAlign: 'left',
                padding: '15px 25px', // More horizontal padding, less vertical
                whiteSpace: 'pre-wrap',
                fontFamily: 'Georgia, serif',
                fontSize: '16px',
                lineHeight: '1.6',
                color: '#333',
                backgroundColor: '#fdfdfd',
                borderRadius: '6px',
                boxShadow: 'inset 0 0 4px rgba(0, 0, 0, 0.05)',
                marginTop: '55px', // Reduced top margin
              }}
            >
              {parsedText.map((pageText, index) => (
                <div key={index} style={{ marginBottom: '40px' }}>
                  <h4 style={{ marginBottom: '10px', color: '#555' }}>Page {index + 1}</h4>
                  <div>{Array.isArray(pageText) ? pageText.join('\n') : pageText}</div>
                </div>
              ))}
            </div>

            <div id="selected-text-container" style={{ display: 'none' }}></div>

            <div
              className="annotation-panel-overlay"
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

        {viewMode === 'pdf' && files.length > 0 && (
          <div
            className="pdf-embed"
            style={{
              width: '100%',
              height: '100%',
              marginTop: '60px',
              borderRadius: '6px',
              overflow: 'hidden',
            }}
          >
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
