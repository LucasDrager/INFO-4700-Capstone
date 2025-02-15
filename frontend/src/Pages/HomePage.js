import React, { useState } from "react";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";

//HTML
const LandingPage = () => {
  const [pdfText, setPdfText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('pdf_file', file);

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/parse-pdf/', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error processing PDF file');
      }
      
      setPdfText(data.message);
    } catch (error) {
      console.error('Error uploading PDF:', error);
      setPdfText(error.message || 'Error processing PDF file');
    }
    setIsLoading(false);
  };

  return (
    <div className="landing-container"> {/*parent container*/}
      <div>
      <main className="container mt-4">
        <h2>Welcome to Our Home Page</h2>
        <p>Explore our features and offerings.</p>
      </main>
    </div>
      {/* Hero Section */}
      <motion.div
        className="hero-section text-center text-white"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="display-3">Welcome to Our Website</h1>
        <p className="lead">Experience innovation with a modern, sleek design.</p>
        <motion.a
          href="about"
          className="btn btn-primary btn-lg"
          whileHover={{ scale: 1.1 }}
        >
          Learn More
        </motion.a>
      </motion.div>

      {/* PDF Upload Section */}
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
          {pdfText && (
            <div className="mt-4">
              <h3>Extracted Text:</h3>
              <div className="text-start bg-light p-3 rounded" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                <pre style={{ whiteSpace: 'pre-wrap' }}>{pdfText}</pre>
              </div>
            </div>
          )}
        </motion.div>
      </div>

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

      {/* Footer */}
      <motion.footer
        className="footer mt-5 text-white text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <p>© 2025 My Website. All rights reserved.</p>
      </motion.footer>
    </div>
  );
};

export default LandingPage;
