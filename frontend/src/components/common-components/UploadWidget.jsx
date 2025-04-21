import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const UploadWidget = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const API_BASE_URL = "http://localhost:8000"; // Adjust if needed

  // Trigger file dialog when "New File" button is clicked
  const handleNewFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle file selection and upload
  const handleFileUpload = async (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (selectedFiles.length === 0) return;

    // For this prototype, we'll use only the first selected PDF
    const file = selectedFiles[0];
    const fileUrl = URL.createObjectURL(file);

    const formData = new FormData();
    formData.append("pdf_files", file);

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/parse-pdf/`, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Error processing PDF file");
      }

      // Redirect to the reading mode page with the uploaded file and parsed text.
      navigate("/reading-mode", {
        state: {
          file: { name: file.name, url: fileUrl },
          pdfText: Array.isArray(data.texts) ? data.texts : []
        },
      });
    } catch (error) {
      console.error("Error uploading PDF:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateFolder = () => {
    alert("Create Folder functionality not implemented yet.");
  };

  return (
  <div className="upload-widget">
    <button className="btn-upload" onClick={handleNewFileClick}>
      <span className="upload-icon">📄</span> Upload PDF
    </button>

    <input
      type="file"
      accept=".pdf"
      ref={fileInputRef}
      onChange={handleFileUpload}
    />

    <button className="btn-folder" onClick={handleCreateFolder}>
      <span className="upload-icon">📁</span> Create Folder
    </button>

    {isLoading && (
      <div className="upload-spinner" role="status">
        Uploading...
      </div>
    )}
  </div>

  );
};

export default UploadWidget;
