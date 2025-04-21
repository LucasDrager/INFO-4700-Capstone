import React from 'react';
import { useNavigate } from 'react-router-dom';

const ButtonsDashboardWidget = () => {
  const navigate = useNavigate();
  const buttons = [
    { id: 1, icon: "📁", route: "/GamesPage" },
    { id: 2, icon: "⌨️", route: "/GamesPage" },
    { id: 3, icon: "🖥️", route: "/GamesPage" },
    { id: 4, icon: "🎮", route: "/GamesPage" } // Route for the games page
  ];

  const handleClick = (btn) => {
    if (btn.route) {
      navigate(btn.route);
    } else {
      console.log(`Button ${btn.id} clicked!`);
    }
  };

  return (
    <div className="d-flex justify-content-around align-items-center flex-wrap BDW-Container">
      {buttons.map((btn) => (
        <button
          key={btn.id}
          className="btn btn-light BDW-Button"
          onClick={() => handleClick(btn)}
        >
          <span className="BDW-Icon">{btn.icon}</span>
        </button>
      ))}
    </div>
  );
};

export default ButtonsDashboardWidget;
