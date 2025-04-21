//DASHBOARD: contains sidebar on the left, and then larger main content area for the dashboard itself.
// in the main content area, theres going to be a column of three things: a myLibrary widget, the file explorer, and then the games buttons.

//the sidebar will show a user profile button at the top, and then the main widget for uploading files or creating folders. then at the bottom the plant widget. 
import React, {useState,useEffect, useRef} from 'react';
import SidebarDashboard from '../components/dashboard-components/SidebarDashboard'; // Import the Sidebar component you created
import { useNavigate } from 'react-router-dom'; // Add this import
import FileExplorerWidget from '../components/dashboard-components/FileExplorerWidget';
import MyLibraryWidget from '../components/dashboard-components/MyLibraryWidget';
import ButtonsDashboardWidget from '../components/dashboard-components/ButtonsDashboard';
import DocumentSpotlightSidebar from '../components/dashboard-components/DocumentSpotlightSidebar';

function DashboardPage() {
  // state to store currently selected document's data (sidebar spotlight)
  //state for visual responsiveness of selection
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const navigate = useNavigate();

  const [highlightedPdf, setHighlightedPdf] = useState(null);

  //making double click functionality: double clicking takes you directly to readmode
  const [lastClickTime, setLastClickTime] = useState(0);

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

  // state to store currently selected document's data (sidebar spotlight)

  //handler for doc selection from fileExplorerWidget
  const handleSelectDoc = (docData, source, e) => {
    setHighlightedPdf(docData.title);

    const currentTime = new Date().getTime();
    const isDoubleClick = currentTime - lastClickTime < 300; // 300ms threshold

    setLastClickTime(currentTime);
    setHighlightedPdf(docData.title);
    //double click
    if (isDoubleClick) {
      // Visual feedback for double click
      if (e && e.currentTarget) {
        e.currentTarget.classList.add('FE-PdfItem-doubleClick');
        setTimeout(() => {
          if (e.currentTarget) {
            e.currentTarget.classList.remove('FE-PdfItem-doubleClick');
          }
        }, 300);
      }

      if (docData && docData.fileUrl) {
        navigate(`/reading-mode?fileUrl=${`http://localhost:8000/media/pdfs/`+encodeURIComponent(docData.title)}&title=${encodeURIComponent(docData.title)}`);
      }
      return;
    }

    //single click
    // If a doc is already selected, first clear it to trigger a full close.
    // After a short delay (e.g., 200ms), reopen the sidebar with the new doc.
      if (selectedDoc) {
        setSelectedDoc(null);
        setTimeout(() => {
          setSelectedDoc({ ...docData, source });
        }, 200);
      } else {
        setSelectedDoc({ ...docData, source });
      }
    };

  // 3) Close button handler in the DocumentSpotlightSidebar
  const handleCloseSpotlight = () => {
    setSelectedDoc(null);
    setHighlightedPdf(null);
  };

  return (
    <div className="dashboard-container">
      <SidebarDashboard onFileUploadSuccess={fetchFiles} />
      <div className="dashboard-mainContentArea">
          <MyLibraryWidget files={uploadedFiles}
            onSelectDoc={(doc, e) => handleSelectDoc(doc, 'library')}
            highlightedPdf={highlightedPdf}
          />
        <FileExplorerWidget files={uploadedFiles}
          onSelectDoc={(doc, e) => handleSelectDoc(doc, 'explorer')}
          highlightedPdf={highlightedPdf}
           />
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


