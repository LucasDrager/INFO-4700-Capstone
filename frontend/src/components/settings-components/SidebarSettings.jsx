// the 'sidebar' that comprises the background of the settings page. 
// rightmost edge mimics SidebarDashboard, including widgets and tab shapes. 
//clicking the tab on the edge of this will close settings and open the dashboard. 

// the sidebar on the dashboard page. 
import { Link } from 'react-router-dom';
import UserProfileWidget from '../common-components/UserProfileWidget';
import UploadWidget from '../common-components/UploadWidget';

const SidebarSettings = () => {
    return (
      <div className="sidebar-settings">
        {/* Top widget: User Profile */}
        <div className="sidebar-settingsTop">
          <UserProfileWidget />
        </div>
  
        {/* Upload docs / create folders */}
        <div className="sidebar-upload">
          <UploadWidget />
          <button className="createFolderBTN">Create Folder</button>
        </div>
  
        <div className="sidebar-settingsTab">
          <Link to="/dashboard">
            <div className="expansionTab">
              <span>∆</span>
            </div>
          </Link>
        </div>
  
        {/* Bottom widget: Plant/Fun Icon */}
        <div className="sidebar-plant">
          <div className="tomogatchiHome">
            <img src="#" alt="placeholder for plant img" />
          </div>
        </div>
      </div>
    );
  };
  
  export default SidebarSettings;