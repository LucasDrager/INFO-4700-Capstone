import React from 'react';
import { useNavigate } from 'react-router-dom';

function DocumentSpotlightSidebar({ documentData, onClose }) {
  const navigate = useNavigate();

  const handleReadModeClick = () => {
    if (documentData?.fileUrl) {
      navigate(`/reading-mode?fileUrl=${encodeURIComponent(documentData.fileUrl)}&title=${encodeURIComponent(documentData.title)}`);
    }
  };

  if (!documentData) return null;

  const { title, description, source } = documentData;

  return (
    <div className="position-fixed end-0 top-0 h-100 bg-dark text-white p-4 shadow-lg" style={{ width: '360px', zIndex: 1050 }}>
      {/* Close tab */}
      <div
        className="position-absolute top-50 start-0 translate-middle-y bg-secondary text-white px-2 py-1 rounded-end shadow"
        style={{ cursor: 'pointer' }}
        onClick={onClose}
      >
        <i className="bi bi-chevron-double-left"></i>
      </div>

      {/* Content */}
      <div className="d-flex flex-column h-100">
        <h4 className="fw-bold mb-1">{title}</h4>
        <p className="text-muted mb-3">From: {source === 'library' ? 'My Library' : 'File Explorer'}</p>

        <div className="mb-3">
          <div className="bg-light text-dark rounded p-2 text-center mb-2">PDF Preview</div>
          <p className="small">{description}</p>
        </div>

        <div className="mt-auto d-grid gap-2">
          <button className="btn btn-success" onClick={handleReadModeClick}>Start Reading</button>
          <button className="btn btn-outline-primary" onClick={() => alert('Move doc to new folder...')}>Move Doc</button>
          <button className="btn btn-outline-info" onClick={() => alert('Show document stats...')}>Document Stats</button>
          <button className="btn btn-outline-danger" onClick={() => alert('Delete document...')}>Delete Doc</button>
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default DocumentSpotlightSidebar;