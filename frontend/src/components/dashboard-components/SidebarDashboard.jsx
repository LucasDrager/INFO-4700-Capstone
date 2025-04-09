// the sidebar on the dashboard page. 
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserProfileWidget from '../common-components/UserProfileWidget';
import UploadWidget from '../common-components/UploadWidget';

console.log('UserProfileWidget:', UserProfileWidget);
console.log('UploadWidget:', UploadWidget);

function SidebarDashboard({ onFileUploadSuccess }) {
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (!files.length) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('pdf_files', files[i])
    }

    setUploading(true);
    setErrorMessage('');

    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.post(
        'http://localhost:8000/upload-pdf/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Upload successful:', response.data);

      // Notify parent to refresh file list
      if (onFileUploadSuccess) {
        onFileUploadSuccess();
      }

      // Optional: Reset file input after upload
      event.target.value = null;
    } catch (error) {
      console.error('Error uploading file:', error);
      setErrorMessage('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const navigate = useNavigate();
  
  const handleExpand = () => {
    navigate('/settings'); {/* expand to settings page */}
  };
  return (
    <div className="sidebar-dashboard">
            <div className="sidebar-dashboardContainer">
                {/* Topmost widget: User/Profile */}
                <div className="sidebar-top">
                <UserProfileWidget />
                </div>
        

                {/* upload docs // create foldrs */}
                <div className="sidebar-upload">
                    <input
                    type="file"
                    accept=".pdf"
                    multiple
                    onChange={handleFileUpload}
                    disabled={uploading}
                    />
            
                    {uploading && <p>Uploading files...</p>}
                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                </div>


                {/* button for the tab on the sidebar to go to settings (expand the sidebar.) */}
                <div className="sidebar-tab" onClick={handleExpand}>
                        <div>
                            <div className="triangle"></div>
                        </div>
                </div>

                {/* Bottom Section: Fun Icon / Plant Widget */}
                <div className="sidebar-plant">
                    <div className="tomogatchiHome">
                        {/* Replace with actual image path or component when available */}
                        <img src="#" alt="placeholder for the plant imgs" />
                    </div>
                </div>

            </div>
        </div>
  );
}

export default SidebarDashboard;