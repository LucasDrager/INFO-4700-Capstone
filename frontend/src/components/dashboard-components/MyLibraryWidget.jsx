//the main header widget in dashboard. 
//contains header, then searchbar for uploaded files & notes 
//then a row of folders. 
//this element will expand when a folder is open to show files in the folder. probably will need a new component for the open folders. 

import React, {useState} from 'react';

function MyLibraryWidget() {
  const folderData = [
    { id: 1, name: 'Folder 1', pdfs: ['file1.pdf', 'file2.pdf', 'file3.pdf'] },
    { id: 2, name: 'Folder 2', pdfs: ['docA.pdf', 'docB.pdf'] },
    { id: 3, name: 'Folder 3', pdfs: ['project.pdf'] },
    { id: 4, name: 'Folder 4', pdfs: ['example.pdf', 'example2.pdf'] },
    { id: 5, name: 'Folder 5', pdfs: ['report.pdf'] },
  ];

  // 2. Create a state variable to track which folder is currently open.
  //    When no folder is open, openFolderId is null.
  const [openFolderId, setOpenFolderId] = useState(null);

  /**
   * handleFolderClick toggles the open/closed state of a folder.
   * If the clicked folder is already open, it closes it.
   * Otherwise, it opens the clicked folder.
   */
  function handleFolderClick(folderId) {
    if (folderId === openFolderId) {
      // If this folder is already open, close it.
      setOpenFolderId(null);
    } else {
      // Open the selected folder.
      setOpenFolderId(folderId);
    }
  }

  // 3. Set the container's class name.
  //    When a folder is open, add the "open" class to extend the width and change background.
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
        {/*
          Render a button for each folder.
          When a button is clicked, call handleFolderClick with the folder's id.
        */}
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

      {/*
        Conditional rendering:
        If a folder is open (openFolderId is not null), find the folder in folderData
        and display its PDFs in a new section.
      */}
      {openFolderId !== null && (
        <div className="myLib-PDFSection">
          {folderData
            .find((folder) => folder.id === openFolderId)
            ?.pdfs.map((pdfName, index) => (
              <div key={index} className="pdf-item">
                <div className="pdf-icon"></div>
                <p className="pdf-title">{pdfName}</p>
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
}

export default MyLibraryWidget;