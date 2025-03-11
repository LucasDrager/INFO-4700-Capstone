

//DASHBOARD: contains sidebar on the left, and then larger main content area for the dashboard itself. 
// in the main content area, theres going to be a column of three things: a myLibrary widget, the file explorer, and then the games buttons. 

//the sidebar will show a user profile button at the top, and then the main widget for uploading files or creating folders. then at the bottom the plant widget. 
import React, {useState, useRef} from 'react';
import SidebarDashboard from '../components/dashboard-components/SidebarDashboard'; // Import the Sidebar component you created

import FileExplorerWidget from '../components/dashboard-components/FileExplorerWidget'; 
import MyLibraryWidget from '../components/dashboard-components/MyLibraryWidget';
import ButtonsDashboardWidget from '../components/dashboard-components/ButtonsDashboard';
import DocumentSpotlightSidebar from '../components/dashboard-components/DocumentSpotlightSidebar';


function DashboardPage() {

  // state to store currently selected document's data (sidebar spotlight)
  const [selectedDoc, setSelectedDoc] = useState(null);


  //handler for doc selection from fileExplorerWidget
  const handleSelectDoc = (docData) => {
    // If a doc is already selected, first clear it to trigger a full close.
    // After a short delay (e.g., 200ms), reopen the sidebar with the new doc.
      if (selectedDoc) {
        setSelectedDoc(null);
        setTimeout(() => {
          setSelectedDoc(docData);
        }, 200);
      } else {
        setSelectedDoc(docData);
      }
    };

  
  

  // 3) Close button handler in the DocumentSpotlightSidebar
  const handleCloseSpotlight = () => {
    setSelectedDoc(null);
  };

    return (
      <div className="dashboard-container">
        <SidebarDashboard />
        <div className="dashboard-mainContentArea">
        <MyLibraryWidget onSelectDoc={handleSelectDoc} />

          {/* Pass in the callback so FileExplorerWidget can “select” a doc */}
          <FileExplorerWidget onSelectDoc={handleSelectDoc}/>
          {/*it would go right here and be called fileExplorerWidget*/}
          <ButtonsDashboardWidget/>
        </div>

        {selectedDoc && (
          <DocumentSpotlightSidebar
          documentData={selectedDoc}
          onClose={handleCloseSpotlight}   
          />
        )}
      </div>
    )}


export default DashboardPage;
