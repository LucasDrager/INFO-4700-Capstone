// SidebarDashboard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserProfileWidget from '../common-components/UserProfileWidget';
const API_BASE = process.env.REACT_APP_API_BASE;

function SidebarDashboard({ onFileUploadSuccess }) {
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]; // Take first selected file
    if (!file) {
      console.error("No file selected");
      setErrorMessage('No file selected. Please choose a file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file); // Append actual file

    setUploading(true);
    setErrorMessage('');

    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.post(
        `${API_BASE}upload_pdf/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // Do not manually set Content-Type for multipart/form-data — let Axios handle it
          },
        }
      );

      console.log('Upload successful:', response.data);

      if (onFileUploadSuccess) {
        onFileUploadSuccess();
      }

      // Reset input
      event.target.value = null;
    } catch (error) {
      console.error('Error uploading file:', error);
      setErrorMessage('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleExpand = () => {
    navigate('/settings');
  };

  return (
    <div className="sidebar-dashboard">
      <div className="sidebar-dashboardContainer">
        {/* Topmost widget: User/Profile */}
        <div className="sidebar-top">
          <UserProfileWidget />
        </div>

        {/* Upload docs */}
        <div className="sidebar-upload">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileUpload} // Simplified
            disabled={uploading}
          />

          {uploading && <p>Uploading file...</p>}
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>

        {/* Settings button */}
        <div className="sidebar-tab" onClick={handleExpand}>
          <div>
            <div className="triangle"></div>
          </div>
        </div>

        {/* Bottom Section: Fun Icon / Plant Widget */}
        <div className="sidebar-plant">
          <div className="tomogatchiHome">
            <img src="#" alt="placeholder for the plant imgs" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SidebarDashboard;
