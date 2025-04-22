import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MyLibraryWidget({ onSelectDoc, highlightedPdf }) {
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

  const folders = files.reduce((acc, file) => {
    const date = new Date(file.uploaded_at);
    const folderName = `${date.getFullYear()}-${date.getMonth() + 1}`;
    if (!acc[folderName]) acc[folderName] = [];
    acc[folderName].push(file);
    return acc;
  }, {});

  const handleFolderClick = (folderName) => {
    setOpenFolder(openFolder === folderName ? null : folderName);
  };

  return (
    <div className="card my-3 shadow-sm">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">My Library</h5>
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search..."
        />
      </div>

      <div className="card-body">
        <div className="d-flex flex-wrap gap-2 mb-3">
          {Object.keys(folders).map((folderName) => (
            <button
              key={folderName}
              className={`btn ${openFolder === folderName ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => handleFolderClick(folderName)}
            >
              {folderName}
            </button>
          ))}
        </div>

        {openFolder && (
          <div className="list-group">
            {folders[openFolder].map((file) => (
              <div
                key={file.id}
                className={`list-group-item list-group-item-action ${highlightedPdf === file ? 'active' : ''}`}
                style={{ cursor: 'pointer' }}
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
                <i className="bi bi-file-earmark-pdf me-2"></i>
                {file.file_name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyLibraryWidget;