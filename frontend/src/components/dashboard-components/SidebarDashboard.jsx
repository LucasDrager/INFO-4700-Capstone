import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserProfileWidget from '../common-components/UserProfileWidget';
import UploadWidget from '../common-components/UploadWidget';
import PlantContainerWidget from '../dashboard-components/PlantContainerWidget';

const SidebarDashboard = ({ collapseMode }) => {
  const navigate = useNavigate();

  // If collapseMode is true, clicking the tab will navigate to /dashboard.
  // Otherwise, it navigates to /settings.
  const handleTabClick = () => {
    if (collapseMode) {
      navigate('/dashboard');
    } else {
      navigate('/settings');
    }
  };

  return (
    <div className="sidebar-dashboard">

      <div className="sidebar-dashboardContainer">
        {/* Top widget: User/Profile */}
        <div className="sidebar-top">
          <UserProfileWidget />
        </div>

        {/* Upload widget */}
        <div className="sidebar-upload">
          <UploadWidget />
        </div>

        {/* Bottom: Plant widget */}
        <div className="sidebar-plant">
            <PlantContainerWidget />
        </div>
      </div>

    {/* The Tab Button */}
    <div className="sidebar-tab" onClick={handleTabClick}>
        <div>
        {/* Use rightTriangle for collapse mode; otherwise, triangle */}
        <div className= "rightTriangle"></div>
        </div>
    </div>
    </div>
  );
};

export default SidebarDashboard;
