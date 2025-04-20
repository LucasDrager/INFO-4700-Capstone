import React from "react";
import "../index.css"; // Import the CSS file for styling
import lecternTitle from "../images/LecternTitle.png";

const Header = () => {
  return (
    <header className="header">
      <img src={lecternTitle} alt="Lectern Logo" className="header-logo" />
      <p>Opening your mind!</p>
    </header>
  );
};

export default Header;
