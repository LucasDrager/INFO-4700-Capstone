import React, { useState, useEffect } from 'react';
import SidebarDashboard from '../components/dashboard-components/SidebarDashboard';
import { useNavigate } from 'react-router-dom';
import FileExplorerWidget from '../components/dashboard-components/FileExplorerWidget';
import MyLibraryWidget from '../components/dashboard-components/MyLibraryWidget';
import ButtonsDashboardWidget from '../components/dashboard-components/ButtonsDashboard';
import DocumentSpotlightSidebar from '../components/dashboard-components/DocumentSpotlightSidebar';
import '../components/AppCSS/dashboard.css'

function DashboardPage() {
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [highlightedPdf, setHighlightedPdf] = useState(null);
  const [lastClickTime, setLastClickTime] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
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

    fetchFiles();
  }, []);

  const handleUploadResponse = (uploadedFile) => {
    setUploadedFiles(prev => [...prev, uploadedFile]);
  };

  const handleSelectDoc = (docData, source, e) => {
    setHighlightedPdf(docData.title);
    const currentTime = new Date().getTime();
    const isDoubleClick = currentTime - lastClickTime < 300;
    setLastClickTime(currentTime);

    if (isDoubleClick && docData?.fileUrl) {
      if (e?.currentTarget && e.currentTarget.classList) {
        e.currentTarget.classList.add('FE-PdfItem-doubleClick');
        setTimeout(() => {
          e.currentTarget?.classList?.remove('FE-PdfItem-doubleClick');
        }, 300);
      }
      navigate(`/reading-mode?fileUrl=${encodeURIComponent(docData.fileUrl)}&title=${encodeURIComponent(docData.title)}`);
      return;
    }

    if (selectedDoc) {
      setSelectedDoc(null);
      setTimeout(() => setSelectedDoc({ ...docData, source }), 200);
    } else {
      setSelectedDoc({ ...docData, source });
    }
  };

  const handleCloseSpotlight = () => {
    setSelectedDoc(null);
    setHighlightedPdf(null);
  };

  return (
    <div className="dashboard">
    <div className="d-flex">
      <SidebarDashboard onFileUploadSuccess={handleUploadResponse} />
      <main className="flex-grow-1 container-fluid py-4">
        <div className="row g-4">
          <div className="col-md-12">
            <MyLibraryWidget
              files={uploadedFiles}
              onSelectDoc={(doc, e) => handleSelectDoc(doc, 'library', e)}
              highlightedPdf={highlightedPdf}
            />
          </div>
          <div className="col-md-12">
            <FileExplorerWidget
              files={uploadedFiles}
              onSelectDoc={(doc, e) => handleSelectDoc(doc, 'explorer', e)}
              highlightedPdf={highlightedPdf}
            />
          </div>
          <div className="col-12">
            <ButtonsDashboardWidget />
          </div>
        </div>
      </main>

      {selectedDoc && (
        <DocumentSpotlightSidebar
          documentData={selectedDoc}
          onClose={handleCloseSpotlight}
        />
      )}
    </div>
    </div>
  );
}

export default DashboardPage;
