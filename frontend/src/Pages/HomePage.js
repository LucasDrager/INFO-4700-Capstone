import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import ExtractedTextAnnotator from "../components/extracted-text-components/ExtractedTextAnnotator";

const LandingPage = () => {
  const [pdfText, setPdfText] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // API base URL - determine based on hostname
  const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:8000'  // Local development
    : 'http://backend:8000';    // Docker environment

  useEffect(() => {
    const testApiConnection = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/parse-pdf/`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'API is not reachable');
        }
        console.log('API is reachable');
      } catch (error) {
        console.error('API connection test failed:', error);
      }
    };
    testApiConnection();
  }, []);

  const handleFileUpload = async (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (selectedFiles.length === 0) return;

    const newFiles = selectedFiles.map(file => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));

    setFiles(prevFiles => [...prevFiles, ...newFiles]);

    const formData = new FormData();
    selectedFiles.forEach(file => formData.append('pdf_files', file));

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/parse-pdf/`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error processing PDF file');
      }
      
      setPdfText(Array.isArray(data.texts) ? data.texts : []);
    } catch (error) {
      console.error('Error uploading PDF:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="landing-container">
      <main className="container mt-4">
        <h2>Welcome to Lectern</h2>
      </main>

      <motion.div
        className="hero-section text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}>
        <motion.a
          href="about"
          className="btn btn-primary btn-lg"
          whileHover={{ scale: 1.1 }}>
          Learn More About Lectern
        </motion.a>
      </motion.div>

      <div className="container text-center mt-5">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="pdf-upload-section">
          <h2>Upload and Parse PDF</h2>
          <div className="mt-4">
            <input
              type="file"
              accept=".pdf"
              multiple
              onChange={handleFileUpload}
              className="form-control"
              style={{ maxWidth: '300px', margin: '0 auto' }}
            />
          </div>

          {isLoading && (
            <div className="mt-3">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}

          {pdfText.length > 0 && (
            <div className="mt-4">
              <ExtractedTextAnnotator 
                pdfText={pdfText} 
                currentPage={currentPage}
                onPageClick={(page) => {
                  setCurrentPage(page);
                  // Find the PDF viewer iframe and navigate to the page || This doesnt work at all
                  const pdfViewer = document.querySelector('iframe');
                  if (pdfViewer?.contentWindow?.PDFViewerApplication) {
                    try {
                      pdfViewer.contentWindow.PDFViewerApplication.page = page;
                    } catch (error) {
                      console.error('Failed to navigate PDF:', error);
                    }
                  }
                }}
              />
            </div>
          )}
        </motion.div>
      </div>

      <div className="pdf-viewer-container">
        {files.map((file, index) => (
          <div key={index} className="pdf-viewer-item">
            <iframe
              src={file.url}
              title={`PDF Viewer ${index}`}
              width="50%"
              height="600px"
              style={{ border: 'none' }}
              onLoad={(e) => {
                const iframe = e.target;
                const checkPDFViewer = setInterval(() => {
                  try {
                    if (iframe.contentWindow.PDFViewerApplication) {
                      clearInterval(checkPDFViewer);
                      
                      // Add message listener for PDF.js events
                      const messageHandler = (event) => {
                        if (event.data?.type === 'pageChanged') {
                          setCurrentPage(event.data.page);
                        }
                      };
                      window.addEventListener('message', messageHandler);

                      // Cleanup listener when component unmounts
                      return () => window.removeEventListener('message', messageHandler);

                      // Setup PDF viewer event listeners
                      iframe.contentWindow.PDFViewerApplication.eventBus.on('pagechanging', (evt) => {
                        window.parent.postMessage({
                          type: 'pageChanged',
                          page: evt.pageNumber
                        }, '*');
                      });
                    }
                  } catch (error) {
                    console.log('PDF viewer not ready yet...');
                  }
                }, 100);

                // Clear interval after 10 seconds to prevent infinite checking
                setTimeout(() => clearInterval(checkPDFViewer), 10000);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LandingPage;
