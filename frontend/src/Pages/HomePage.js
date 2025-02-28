import React, { useState } from "react";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import ExtractedTextAnnotator from "../components/extracted-text-components/ExtractedTextAnnotator"; // Added the component here

//HTML
const LandingPage = () => {
  const [pdfText, setPdfText] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [files, setFiles] = useState([]); // We might have to connect to database to store the files later...

// This is a function to test the connection to the API
  const testApiConnection = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/parse-pdf/');
      if (!response.ok) {
        throw new Error('API is not reachable');
      }
      console.log('API is reachable');
    } catch (error) {
      console.error('API connection test failed:', error);
    }
  };
  // Call this function when the component mounts or when needed
  testApiConnection();

  const handleFileUpload = async (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (selectedFiles.length === 0) return;

    const newFiles = selectedFiles.map(file => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));

    setFiles(prevFiles => [...prevFiles, ...newFiles]);
    setFileName(selectedFiles[0].name);

    const formData = new FormData();
    selectedFiles.forEach(file => formData.append('pdf_files', file));

   // formData.append('pdf_file', selectedFiles);

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/parse-pdf/', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      console.log('API Response:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Error processing PDF file');
      }
      

      setPdfText(Array.isArray(data.texts) ? data.texts : []); // pdfText is an array

    } catch (error) {
      console.error('Error uploading PDF:', error);
    }
    setIsLoading(false);
  };

  return (
    <div className="landing-container"> {/*parent container*/}
      <div>
      <main className="container mt-4">
        <h2>Welcome to Lectern</h2>
        <p></p>
      </main>
    </div>
      {/* Hero Section */}
      <motion.div
        className="hero-section text-center "
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
          className="pdf-upload-section"
        >
          <h2>Upload and Parse PDF</h2>
          <div className="mt-4">
            <input
              type="file"
              accept=".pdf"
              multiple onChange={handleFileUpload}
              className="form-control"
              style={{ maxWidth: '300px', margin: '0 auto' }}
            />
          </div>
          {!isLoading ? null : (
            <div className="mt-3">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}

          {pdfText.length === 0 ? null : (
            <div className="mt-4">
              <ExtractedTextAnnotator pdfText={pdfText} />
            </div>
          )}
        </motion.div>
      </div>
      <div>
      {/* <input type="file" multiple onChange={handleFileUpload} /> */}
      {files.map((file, index) => (
        <div key={index}>
          <p>Selected file: {file.name}</p>
          <iframe
            src={file.url}
            title={`PDF Viewer ${index}`}
            width="50%"
            height="600px"
            style={{ border: 'none' }}
          ></iframe>
        </div>
      ))}
      {/*Show the PDF in a pdf reader as well!*/}
    {/* //  This is not working as intended so far so I will have to change this later...
   <div>
      <input type="file" onChange={handleFileUpload} />
      {fileName && <p>Selected file: {fileName}</p>}
      {fileUrl && (
        <iframe
          src={fileUrl}
          title="PDF Viewer"
          width="100%"
          height="600px"
          style={{ border: 'none' }}
        ></iframe>
      )}
    </div>  */}

 {/* Features Section */}
      <div id="about" className="container text-center mt-5">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          Why Choose Us?
        </motion.h2>
        <div className="row mt-4">
          <motion.div
            className="col-md-4"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <i className="bi bi-lightning-fill feature-icon"></i>
            <h4>Fast Performance</h4>
            <p>Optimized for speed and efficiency.</p>
          </motion.div>
          <motion.div
            className="col-md-4"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <i className="bi bi-lock-fill feature-icon"></i>
            <h4>Secure</h4>
            <p>Industry-leading security standards.</p>
          </motion.div>
          <motion.div
            className="col-md-4"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <i className="bi bi-code-slash feature-icon"></i>
            <h4>Developer Friendly</h4>
            <p>Built with modern technologies.</p>
          </motion.div>
        </div>
      </div>
      </div>

      {/* Footer */}
      <motion.footer
        className="footer mt-5 text-white text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <p>© 2025 Lectern. All rights reserved.</p>
      </motion.footer>
    </div>
  );
};

export default LandingPage;
