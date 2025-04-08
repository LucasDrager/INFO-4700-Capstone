import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MyLibraryWidget({ onSelectDoc }) {
  const [files, setFiles] = useState([]);
  const [openFolder, setOpenFolder] = useState(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get('http://localhost:8000/list-pdfs/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        setFiles(response.data);
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    fetchFiles();
  }, []);

  // Group files by "folder" - we'll use upload date as a pseudo-folder
  const folders = files.reduce((acc, file) => {
    const date = new Date(file.uploaded_at);
    const folderName = `${date.getFullYear()}-${date.getMonth() + 1}`;
    if (!acc[folderName]) acc[folderName] = [];
    acc[folderName].push(file);
    return acc;
  }, {});

  const handleFolderClick = (folderName) => {
    if (folderName === openFolder) {
      setOpenFolder(null);
    } else {
      setOpenFolder(folderName);
    }
  };

  const widgetClass = openFolder ? "myLib-DashboardWidget open" : "myLib-DashboardWidget";

  return (
    <div className={widgetClass}>
      <div className="myLib-Header">
        <h2>my Library</h2>
        <input
          type="text"
          placeholder="Search..."
          className="myLib-Search"
        />
      </div>

      <div className="myLib-Folders">
        {Object.keys(folders).map((folderName) => (
          <button
            key={folderName}
            className="folder-button"
            onClick={() => handleFolderClick(folderName)}
          >
            {folderName}
          </button>
        ))}
      </div>

      {openFolder && (
        <div className="myLib-PDFSection">
          {folders[openFolder].map((file) => (
            <div
              key={file.id}
              className="FE-PdfItem"
              onClick={() => {
                if (onSelectDoc) {
                  onSelectDoc({
                    title: file.file_name,
                    description: `Uploaded at ${new Date(file.uploaded_at).toLocaleString()}`,
                    fileUrl: `http://localhost:8000/media/${file.file}`
                  });
                }
              }}
            >
              <div className="FE-PdfIcon"></div>
              <p className="FE-PdfTitle">{file.file_name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyLibraryWidget;
