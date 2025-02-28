import React from 'react';
import SidebarSettings from '../components/settings-components/SidebarSettings';
import '../index.css';

const SettingsPage = () => {
  return (
    <div className="settings-Container">
      {/* Left side: main settings content */}
      <div className="settings-mainContentArea">
        <h1>Settings</h1>
        {/* Your settings form or content here */}
      </div>

      {/* Right side: the sidebar */}
      <SidebarSettings />
    </div>
  );
};

export default SettingsPage;
