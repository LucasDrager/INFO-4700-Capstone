import React, { useState } from 'react';

function MyLibraryWidget({ onSelectDoc, highlightedPdf }) {
  const folderData = [
    { id: 1, name: 'Folder 1', pdfs: ['file1.pdf', 'file2.pdf', 'file3.pdf'] },
    { id: 2, name: 'Folder 2', pdfs: ['docA.pdf', 'docB.pdf'] },
    { id: 3, name: 'Folder 3', pdfs: ['project.pdf'] },
    { id: 4, name: 'Folder 4', pdfs: ['example.pdf', 'example2.pdf'] },
    { id: 5, name: 'Folder 5', pdfs: ['report.pdf'] },
  ];

  const [openFolderId, setOpenFolderId] = useState(null);

  function handleFolderClick(folderId) {
    if (folderId === openFolderId) {
      setOpenFolderId(null);
    } else {
      setOpenFolderId(folderId);
    }
  }

  const widgetClass = openFolderId ? "myLib-DashboardWidget open" : "myLib-DashboardWidget";



  return (
    <div className={widgetClass}>
      {/* Header + Search Row */}
      <div className="myLib-Header">
        <h2>my Library</h2>
        <input
          type="text"
          placeholder="Search..."
          className="myLib-Search"
        />
      </div>

      {/* Folders Section */}
      <div className="myLib-Folders">
        {folderData.map((folder) => (
          <button
            key={folder.id}
            className="folder-button"
            onClick={() => handleFolderClick(folder.id)}
          >
            {folder.name}
          </button>
        ))}
      </div>

      {/* PDFs in the open folder */}
      {openFolderId !== null && (
        <div className="myLib-PDFSection">
          {folderData
            .find((folder) => folder.id === openFolderId)
            ?.pdfs.map((pdfName, index) => (
              <div
                key={index}
                className={`FE-PdfItem ${highlightedPdf === pdfName ? 'FE-PdfItem-selected' : ''}`}
                onClick={(e) => {
                  if (onSelectDoc) {
                    onSelectDoc({
                      title: pdfName,
                      description: `Description for ${pdfName}`
                    }, 'library', e);
                  }
                }}
              >
                <div className="FE-PdfIcon"></div>
                <p className="FE-PdfTitle">{pdfName}</p>
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
}

export default MyLibraryWidget;
