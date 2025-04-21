// the 'sidebar' that comprises the background of the settings page.
// rightmost edge mimics SidebarDashboard, including widgets and tab shapes.
//clicking the tab on the edge of this will close settings and open the dashboard.

// the sidebar on the dashboard page.
import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserProfileWidget from '../common-components/UserProfileWidget';
import SettingsWidget from '../settings-components/SettingsWidget.jsx';
import UploadWidget from '../common-components/UploadWidget';
import PlantContainerWidget from '../dashboard-components/PlantContainerWidget'; // reuse same plant widget

const SidebarSettings = () => {
    const navigate = useNavigate();

    const handleExpand = () => {
        navigate('/dashboard'); {/* collapse to dashboard page */}
    };
    return (
        <div className="sidebar-settings text-white">
          {/* Main content area for settings (if needed) */}
          <div className="sidebar-settingsMainContent">
            <SettingsWidget />
          </div>
          {/* Mimic container that visually matches the dashboard sidebar */}
          <div className="sidebar-settingsMimic">
            {/* Top widget: User Profile */}
            <div className="sidebar-top">
              <UserProfileWidget />
            </div>
            {/* Upload widget */}
            <div className="sidebar-upload">
              <UploadWidget />
            </div>
            {/* Expand/Collapse Tab - keep unique functionality */}
            <div className="sidebar-tab" onClick={handleExpand}>
              <div>

                <div className="rightTriangle"></div>
              </div>
            </div>
            {/* Bottom widget: Plant (or fun) Icon */}
            <div className="sidebar-plant">
              <PlantContainerWidget />
            </div>
          </div>
        </div>
      );
    };

    export default SidebarSettings;