// the sidebar on the dashboard page. 
import React from 'react';
import { Link } from 'react-router-dom';
import UserProfileWidget from '../common-components/UserProfileWidget';
import UploadWidget from '../common-components/UploadWidget';

console.log('UserProfileWidget:', UserProfileWidget);
console.log('UploadWidget:', UploadWidget);



const SidebarDashboard = () => {
    return (
    <div className="sidebar-dashboard">
        
        {/* Topmost widget: User/Profile */}
        <div className="sidebar-top">
          <UserProfileWidget />
        </div>
  

        {/* upload docs // create foldrs */}
        <div className="sidebar-upload">
            *<UploadWidget />*
            <button className="createFolderBTN">Create Folder</button>
        </div>


        {/* button for the tab on the sidebar to go to settings (expand the sidebar.) */}
        <div className="sidebar-tab">
            <Link to="/settings"> {/* the whole thing is a link */}
                <div className="expansionTab">
                    <span></span>
                </div>
            </Link>
        </div>

        {/* Bottom Section: Fun Icon / Plant Widget */}
         <div className="sidebar-plant">
            <div className="tomogatchiHome">
                {/* Replace with actual image path or component when available */}
                <img src="#" alt="placeholder for the plant imgs" />
            </div>
        </div>
    </div> 
    );
};

export default SidebarDashboard;