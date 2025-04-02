import React from 'react';

function ReadingContainer({ isSidebarCollapsed, file }) {
  const placeholderPdfs = ['filename.pdf'];
  const sidebarWidth = isSidebarCollapsed ? '40px' : '300px'; // Adjust the width based on the sidebar state

  return (
    <div 
      className="FE-WidgetContainer"
      style={{
        display: 'flex',
        justifyContent: 'center', // Center horizontally
        alignItems: 'center', // Center vertically
        height: '100vh', // Full viewport height
        width: `calc(100vw - ${sidebarWidth})`, // Adjust width based on the sidebar state
        marginLeft: sidebarWidth, // Offset by the sidebar width
        transition: 'width 0.3s ease, margin-left 0.3s ease', // Smooth transition when the sidebar state changes
      }}
    >
      <div 
        className="FE-InnerContainer"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f4f4f4',
          padding: '40px',
          borderRadius: '10px',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          width: '100%', // Take full width of the container
          height: '100%', // Take full height of the container
          textAlign: 'center',
        }}
      >
        {file ? (
          // If a file is provided, show the embedded PDF
          <div className="pdf-embed" style={{ width: '80%', margin: '0 auto' }}>
            <iframe
              src={file.url}
              title={file.name}
              width="100%"
              height="600px"
              style={{ border: 'none' }}
            />
          </div>
        ) : (
          // Otherwise, show the original placeholder(s)
          placeholderPdfs.map((pdf, index) => (
            <div 
              key={index} 
              className="FE-PdfItem"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#fff',
                borderRadius: '5px',
                padding: '20px',
                width: '100%',
                height: '100%',
              }}
            >
              <p 
                className="FE-PdfTitle"
                style={{
                  fontSize: '24px', // Larger text
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}
              >
                {pdf}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ReadingContainer;
