import React from 'react';

function FileExplorerWidget({ files, onSelectDoc, highlightedPdf }) {
  const handleClick = (file, e) => {
    e.stopPropagation();
    if (onSelectDoc) {
      onSelectDoc({
        title: file.file_name,
        description: `Uploaded at ${new Date(file.uploaded_at).toLocaleString()}`,
        fileUrl: file.file.startsWith('http') ? file.file : `http://localhost:8000/${file.file}`,
      }, e);
    }
  };

  return (
    <div className="card my-3 shadow-sm">
      <div className='card-header d-flex justify-content-between align-items-center'>
        <h5 className="mb-3 fw-semibold">File Explorer</h5>
      </div>
      <div className='card-body'>
        <div className='container-fluid '>
          <div className="row row-cols-2 row-cols-md-3 g-3">
            {files.length === 0 ? (
              <p className="text-center text-muted">No files uploaded yet.</p>
            ) : (
              files.map((file) => (
                <div className="col" key={file.id}>
                  <div
                    className={`card text-center p-3 border-0 shadow-sm h-100 pdf-item ${highlightedPdf === file.file_name ? 'border-primary' : ''}`}
                    onClick={(e) => handleClick(file, e)}
                    style={{ cursor: 'pointer' }}
                  >
                    <i className="bi bi-file-earmark-pdf text-danger fs-1 mb-2"></i>
                    <p className="mb-0 small text-truncate">{file.file_name}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FileExplorerWidget;
