import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserProfileWidget from '../common-components/UserProfileWidget';
import PlantContainerWidget from '../dashboard-components/PlantContainerWidget';
const API_BASE = process.env.REACT_APP_API_BASE;

function SidebarDashboard({ onFileUploadSuccess, collapseMode }) {
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      setErrorMessage('No file selected. Please choose a file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    setErrorMessage('');

    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.post(
        `${API_BASE}upload_pdf/`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const uploaded = response.data;
      if (onFileUploadSuccess) {
        onFileUploadSuccess(uploaded);
      }
      event.target.value = null;
    } catch (error) {
      console.error('Upload failed:', error);
      setErrorMessage('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleTabClick = () => {
    navigate(collapseMode ? '/dashboard' : '/settings');
  };

  return (
    <div className="d-flex flex-column justify-content-between bg-light border-end p-3" style={{ width: '280px', minHeight: '100vh' }}>
      <div>
        <div className="mb-4">
          <UserProfileWidget />
        </div>

        <div className="mb-3">
        <label htmlFor="fileUpload" className="form-label fw-semibold">Upload PDF</label>
          <input
            id="fileUpload"
            type="file"
            accept=".pdf"
            className="form-control form-control-sm"
            onChange={handleFileUpload}
            disabled={uploading}
          />
          {uploading && <div className="form-text">Uploading...</div>}
          {errorMessage && <div className="text-danger small mt-1">{errorMessage}</div>}
        </div>
      </div>

      <div>
        <PlantContainerWidget />
      </div>

      {/* <div
        className="position-absolute top-50 end-0 translate-middle-y bg-primary text-white px-2 py-1 rounded-start shadow"
        onClick={handleTabClick}
        style={{ cursor: 'pointer' }}
      >
        <i className="bi bi-chevron-double-right"></i>
      </div> */}
    </div>
  );
};

export default SidebarDashboard;