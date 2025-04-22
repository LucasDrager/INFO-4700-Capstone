import React from 'react';

function FileExplorerWidget({ files, onSelectDoc, highlightedPdf }) {
  const handleClick = (file, e) => {
    e.stopPropagation();
    if (onSelectDoc) {
      onSelectDoc({
        title: file.file_name,
        description: `Uploaded at ${new Date(file.uploaded_at).toLocaleString()}`,
        fileUrl: file.file.startsWith('http') ? file.file : `http://localhost:8000/${file.file}`,
      }, e); // pass event to support double-click logic
    }
  };

  return (
    <div className="FE-WidgetContainer">
      <div className="FE-InnerContainer">
        {files.length === 0 ? (
          <p style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
            No files uploaded yet.
          </p>
        ) : (
          files.map((file) => (
            <div
              key={file.id}
              className={`FE-PdfItem ${highlightedPdf === file.file_name ? 'FE-PdfItem-selected' : ''}`}
              onClick={(e) => handleClick(file, e)}
            >
              <div className="FE-PdfIcon" />
              <p className="FE-PdfTitle">{file.file_name}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default FileExplorerWidget;
