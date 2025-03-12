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
    <div className="documentSpotlightSidebar">
      {/* Tab for closing, mirrored from the left sidebar */}
      <div className="documentSpotlightTab" onClick={onClose}>
        <div className="triangle"></div>
      </div>

      <div className="documentSpotlightContent">
        {/* Title at the top */}
        <h3 className="documentSpotlightTitle">{title}</h3>

        {/* Row containing the PDF preview icon (overhanging left) and description */}
        <div className="documentSpotlightRow">
          <div className="documentSpotlightPreview">
            <div className="previewPlaceholder">PDF Preview</div>
          </div>
          <div className="documentSpotlightDesc">
            <p>{description}</p>
          </div>
        </div>

        {/* Action buttons at the bottom */}
        <div className="documentSpotlightButtons">
          <button onClick={handleReadModeClick}>Start Reading</button>
          <button onClick={() => alert('Move doc to new folder...')}>Move Doc</button>
          <button onClick={() => alert('Show document stats...')}>Document Stats</button>
          <button onClick={() => alert('Delete document...')}>Delete Doc</button>
        </div>
      </div>
    </div>
  );
}

export default DocumentSpotlightSidebar;
