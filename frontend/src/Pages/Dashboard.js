

//DASHBOARD: contains sidebar on the left, and then larger main content area for the dashboard itself. 
// in the main content area, theres going to be a column of three things: a myLibrary widget, the file explorer, and then the games buttons. 

//the sidebar will show a user profile button at the top, and then the main widget for uploading files or creating folders. then at the bottom the plant widget. 
import React, {useState,useEffect, useRef} from 'react';
import SidebarDashboard from '../components/dashboard-components/SidebarDashboard'; // Import the Sidebar component you created

import FileExplorerWidget from '../components/dashboard-components/FileExplorerWidget'; 
import MyLibraryWidget from '../components/dashboard-components/MyLibraryWidget';
import ButtonsDashboardWidget from '../components/dashboard-components/ButtonsDashboard';
import DocumentSpotlightSidebar from '../components/dashboard-components/DocumentSpotlightSidebar';

import { useNavigate } from 'react-router-dom';

function DashboardPage() {
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const navigate = useNavigate();

  const fetchFiles = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/list-pdfs/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setUploadedFiles(data);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  // Fetch files when component mounts
  useEffect(() => {
    fetchFiles();
  }, []);

  const handleSelectDoc = (docData) => {
    if (docData && docData.fileUrl) {
      navigate(`/reading-mode?fileUrl=${`http://localhost:8000/media/pdfs/`+encodeURIComponent(docData.title)}&title=${encodeURIComponent(docData.title)}`);
    }
  };

  const handleCloseSpotlight = () => {
    setSelectedDoc(null);
  };

  return (
    <div className="dashboard-container">
      <SidebarDashboard onFileUploadSuccess={fetchFiles} />
      <div className="dashboard-mainContentArea">
        <MyLibraryWidget files={uploadedFiles} onSelectDoc={handleSelectDoc} />
        <FileExplorerWidget files={uploadedFiles} onSelectDoc={handleSelectDoc} />
        <ButtonsDashboardWidget />
      </div>

      {selectedDoc && (
        <DocumentSpotlightSidebar
          documentData={selectedDoc}
          onClose={handleCloseSpotlight}
        />
      )}
    </div>
  );
}


export default DashboardPage;


