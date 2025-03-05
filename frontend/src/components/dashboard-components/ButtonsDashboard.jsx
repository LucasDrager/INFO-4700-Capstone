//this is the bottommost element on Dashboard --- it is the container for the buttons to open the games. 

import React from 'react';

const ButtonsDashboardWidget = () => {
  const buttons = [
    { id: 1, icon: "📁" }, // Replace with actual icon components if using a library
    { id: 2, icon: "⌨️" },
    { id: 3, icon: "🖥️" },
    { id: 4, icon: "🎮" }
  ];

  return (
    <div className="BDW-Container">
      {buttons.map((btn) => (
        <button key={btn.id} className="BDW-Button">
          <span className="BDW-Icon">{btn.icon}</span>
        </button>
      ))}
    </div>
  );
};

export default ButtonsDashboardWidget;
