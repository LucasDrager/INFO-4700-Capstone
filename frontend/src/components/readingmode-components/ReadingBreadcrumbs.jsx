import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function ReadingBreadcrumbs() {
  const navigate = useNavigate();
  const location = useLocation();
  const documentData = location.state?.document;
  const filename = documentData ? documentData.title : 'Unknown File';

  return (
    <div className="reading-breadcrumbs">
      <button
        className="breadcrumb-arrow"
        onClick={() => navigate('/dashboard')}
      >
        ←
      </button>
      <span
        className="breadcrumb-item"
        onClick={() => navigate('/dashboard')}
      >
        Dashboard
      </span>
      <span className="breadcrumb-separator">{'>'}</span>
      <span className="breadcrumb-item active">{filename}</span>
    </div>
  );
}

export default ReadingBreadcrumbs;
