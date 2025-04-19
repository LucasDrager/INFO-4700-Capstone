import React from 'react';
import { useNavigate } from 'react-router-dom';

function DocumentSpotlightSidebar({ documentData, onClose }) {
  const navigate = useNavigate();

  const handleReadModeClick = () => {
    navigate('/reading-mode');
  };

  if (!documentData) return null;

  const { title, description } = documentData;

  return (
    <div className="documentSpotlightSidebar text-white p-3 rounded">
      {/* Close tab */}
      <div className="documentSpotlightTab" onClick={onClose}>
        <div className="triangle"></div>
      </div>

      <div className="documentSpotlightContent">
        <h3 className="documentSpotlightTitle">{title}</h3>
        <p>From: {documentData.source === 'library' ? 'My Library' : 'File Explorer'}</p>

        <div className="documentSpotlightRow">
          <div className="documentSpotlightPreview">
            <div className="previewPlaceholder">PDF Preview</div>
          </div>
          <div className="documentSpotlightDesc">
            <p>{description}</p>
          </div>
        </div>

        <div className="documentSpotlightButtons">
          <button className="btn-custom" onClick={handleReadModeClick}>Start Reading</button>
          <button className="btn-custom" onClick={() => alert('Move doc to new folder...')}>Move Doc</button>
          <button className="btn-custom" onClick={() => alert('Show document stats...')}>Document Stats</button>
          <button className="btn-custom" onClick={() => alert('Delete document...')}>Delete Doc</button>
          <button className="btn-custom" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default DocumentSpotlightSidebar;
