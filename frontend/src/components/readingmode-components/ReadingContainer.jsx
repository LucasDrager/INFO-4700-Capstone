import React, { useState, useEffect } from 'react';

function ReadingContainer({ isSidebarCollapsed }) {
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

      setParsedText(data.texts || []);
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
        {/* Reading Timer */}
      <div
        className="reading-timer"
        style={{
          backgroundColor: '#a5d6a7',
          color: '#333',
          fontWeight: 'bold',
          padding: '6px 12px', // Reduced padding to make it smaller
          borderRadius: '5px', // Adjust border radius to match the button's radius
          fontSize: '14px', // Reduced font size to make it smaller
          opacity: 0.8, // Keep it more opaque
          marginBottom: '20px', // Add some space below the timer
          textAlign: 'center',
          position: 'absolute',
          top: '10px',
          left: '50%',
          transform: 'translateX(-50%)', // Center the timer horizontally
  }}
>
  {formatTime(timer)}
</div>


        {/* Switch View Button */}
        {files.length > 0 && parsedText.length > 0 && (
          <button
            onClick={() => setViewMode(viewMode === 'text' ? 'pdf' : 'text')}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              backgroundColor: '#a5d6a7',
              color: '#333',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
              opacity: 0.7, // Button is more opaque by default
              transition: 'opacity 0.3s, background-color 0.3s', // Smooth transition for opacity and background-color
            }}
            onMouseEnter={(e) => {
              e.target.style.opacity = 1; // Full opacity on hover
              e.target.style.backgroundColor = '#81c784'; // Darker shade of the original color
            }}
            onMouseLeave={(e) => {
              e.target.style.opacity = 0.7; // Revert back to more opaque state
              e.target.style.backgroundColor = '#a5d6a7'; // Original color on hover leave
            }}
          >
            Switch to {viewMode === 'text' ? 'PDF View' : 'Text View'}
          </button>
        )}

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

        {/* Interactive Text View */}
        {viewMode === 'text' && parsedText.length > 0 && (
          <div
            className="interactive-text"
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
            {parsedText.map((pageText, index) => (
              <div key={index} style={{ marginBottom: '40px' }}>
                <h4 style={{ marginBottom: '10px', color: '#555' }}>Page {index + 1}</h4>
                <div>{pageText}</div>
              </div>
            ))}
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











