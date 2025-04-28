// appears at the top of the dashboard sidebar, contains user profile img, username and email displayed. 
// also appears at top of rightmost column in sidebar settings page. 
import React from "react";
import { useAuth, AuthProvider } from "../../AuthContext"

const UserProfileWidget = () => {
const { logoutUser } = useAuth();
  //Log out function
  const handleLogout = async(e) => {
    e.preventDefault();
    const response = await logoutUser();
    // Redirect to login page or show a success message
    window.location.href = '/login';
  };

  return (
    <div class="btn-group" role="group" aria-label="Basic example">
      <a type="button" class="btn btn-primary btn-lg" href="/settings">Profile</a>
      <a type="button"  onClick={handleLogout} class="btn btn-primary btn-lg">Log out</a>
    </div>
  )
};

export default UserProfileWidget;

