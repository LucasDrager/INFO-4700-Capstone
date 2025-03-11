import React from 'react';

function DocumentSpotlightSidebar({ documentData, onClose }) {
  if (!documentData) return null;

  const { title, description } = documentData;

  return (
    <div className="documentSpotlightSidebar">
      <div className="documentSpotlightContent">
        {/* Title at the top */}
        <h3 className="documentSpotlightTitle">{title}</h3>

        {/* Row with PDF preview (overhanging left) and description */}
        <div className="documentSpotlightRow">
          <div className="documentSpotlightPreview">
            <div className="previewPlaceholder">PDF Preview</div>
          </div>
          <div className="documentSpotlightDesc">
            <p>{description}</p>
          </div>
        </div>

        {/* Buttons at the bottom */}
        <div className="documentSpotlightButtons">
          <button onClick={() => alert('Go to Read Mode')}>Read Mode</button>
          <button onClick={() => alert('Move doc to new folder...')}>Move Doc</button>
          <button onClick={() => alert('Show document stats...')}>Document Stats</button>
          <button onClick={() => alert('Delete document...')}>Delete Doc</button>
        </div>
      </div>
      
      {/* Tab for closing (mirrored from left sidebar) */}
      <div className="documentSpotlightTab" onClick={onClose}>
        <div className="triangle"></div>
      </div>
    </div>
  );
}

export default DocumentSpotlightSidebar;
