//will eventually contain the actual file explorer logic, but for nowcwill display rectangles as placeholders representing PDFs
import React, { useState } from 'react';

function FileExplorerWidget({ onSelectDoc }) {
  const placeholderPdfs = [
    'filename1.pdf',
    'filename2.pdf',
    'filename3.pdf',
    'filename4.pdf',
    'filename5.pdf',
    'filename6.pdf',
    'filename7.pdf',
    'filename8.pdf',
    'filename9.pdf',
    'filename10.pdf',
    'filename11.pdf',
    'filename12.pdf',
    'filename13.pdf',
    'filename14.pdf',
    'filename15.pdf',
    'filename16.pdf',
  ];

  const handleClick = (pdf, e) => {
    // Prevent the click event from bubbling up.
    e.stopPropagation();
    if (onSelectDoc) {
      onSelectDoc({
        title: pdf,
        description: `Description for ${pdf}`
      });
    }
  };

  return (
    <div className="FE-WidgetContainer">
      <div className="FE-InnerContainer">
        {placeholderPdfs.map((pdf, index) => (
          <div 
            key={index} 
            className="FE-PdfItem"
            onClick={(e) => handleClick(pdf, e)}
          >
            <div className="FE-PdfIcon"></div>
            <p className="FE-PdfTitle">{pdf}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FileExplorerWidget;

