// the 'sidebar' that comprises the background of the settings page. 
// rightmost edge mimics SidebarDashboard, including widgets and tab shapes. 
//clicking the tab on the edge of this will close settings and open the dashboard. 

// the sidebar on the dashboard page. 
import { useNavigate } from 'react-router-dom';
import UserProfileWidget from '../common-components/UserProfileWidget';
import SettingsWidget from '../settings-components/SettingsWidget.jsx';
import UploadWidget from '../common-components/UploadWidget';

const SidebarSettings = () => {
    const navigate = useNavigate();
    
    const handleExpand = () => {
        navigate('/dashboard'); {/* collapse to dashboard page */}
    };
    
    return (
    <div className="sidebar-settings"> {/* contains row: maincontent and dashboardMimic */}

        <div className="sidebar-settingsMainContent">
            <SettingsWidget />
        </div> 

        <div className="sidebar-settingsMimic">
            {/* Top widget: User Profile */}
            <div className="sidebar-settingsTop">
                <UserProfileWidget />
            </div>

            {/* Upload docs / create folders */}
            <div className="sidebar-upload">
                *<UploadWidget />*
            </div>

            <div className="sidebar-tab" onClick={handleExpand}>
                    <div>
                        <div className="rightTriangle"></div>
                    </div>
            </div>
    
            {/* Bottom widget: Plant/Fun Icon */}
            <div className="sidebar-plant">
                <div className="tomogatchiHome">
                    <img src="#" alt="placeholder for plant img" />
                </div>
            </div>

        </div>
    </div>
    );
  };
  
  export default SidebarSettings;