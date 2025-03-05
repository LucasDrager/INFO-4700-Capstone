

//DASHBOARD: contains sidebar on the left, and then larger main content area for the dashboard itself. 
// in the main content area, theres going to be a column of three things: a myLibrary widget, the file explorer, and then the games buttons. 

//the sidebar will show a user profile button at the top, and then the main widget for uploading files or creating folders. then at the bottom the plant widget. 
import React from 'react';
import SidebarDashboard from '../components/dashboard-components/SidebarDashboard'; // Import the Sidebar component you created

import FileExplorerWidget from '../components/dashboard-components/FileExplorerWidget'; 
import MyLibraryWidget from '../components/dashboard-components/MyLibraryWidget';
import ButtonsDashboardWidget from '../components/dashboard-components/ButtonsDashboard';


function DashboardPage() {
    return (
      <div className="dashboard-container">
        <SidebarDashboard />
        <div className="dashboard-mainContentArea">
          <MyLibraryWidget />
          <FileExplorerWidget />
          {/*it would go right here and be called fileExplorerWidget*/}
          <ButtonsDashboardWidget/>
        </div>
      </div>
    );
  }

export default DashboardPage;
