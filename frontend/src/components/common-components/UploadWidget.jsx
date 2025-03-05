// this widget is where the button for uploading to the library and creating folders in the library will live. 
// this widget belongs just under the UserProfileWidget on SidebarDashboard and SidebarSettings. 

import React from 'react';

const UploadWidget = () => {
  return ( 
  <div>
      <button className="createFolderBTN">New File</button>
      <button className="createFolderBTN">Create Folder</button>
  </div>);
};

export default UploadWidget;


