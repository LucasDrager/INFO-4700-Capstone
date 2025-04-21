import React, { useState, useEffect } from 'react';
import axios from 'axios';

function FileExplorerWidget({ onSelectDoc, highlightedPdf }) {
  const [pdfFiles, setPdfFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get('http://localhost:8000/list-pdfs/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        setPdfFiles(response.data);
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    fetchFiles();
  }, []);

  const handleClick = (file, e) => {
    e.stopPropagation();
    if (onSelectDoc) {
      onSelectDoc({
        title: file.file_name,
        description: `Uploaded at ${new Date(file.uploaded_at).toLocaleString()}`,
        fileUrl: `http://localhost:8000/media/${file.file}`
      });
    }
  };

  return (
    <div className="FE-WidgetContainer">
      <div className="FE-InnerContainer">
        {pdfFiles.map((file) => (
          <div
            key={file.id}
            className={`FE-PdfItem ${highlightedPdf === file ? 'FE-PdfItem-selected' : ''}`}
            onClick={(e) => handleClick(file, e)}
          >
            <div className="FE-PdfIcon"></div>
            <p className="FE-PdfTitle">{file.file_name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FileExplorerWidget;
