import React from 'react';
import { useNavigate } from 'react-router-dom';

const ButtonsDashboardWidget = () => {
  const navigate = useNavigate();
  const buttons = [
    { id: 1, icon: "📁", route: "/GamesPage", label: "Files" },
    { id: 2, icon: "⌨️", route: "/GamesPage", label: "Keyboard" },
    { id: 3, icon: "🖥️", route: "/GamesPage", label: "Desktop" },
    { id: 4, icon: "🎮", route: "/GamesPage", label: "Games" }
  ];

  const handleClick = (btn) => {
    if (btn.route) {
      navigate(btn.route);
    }
  };

  return (
    <div className="card my-3 shadow-sm">
      <div className="card-header">
        <h5 className="mb-0">Tools</h5>
      </div>
      <div className="card-body">
        <div className="d-flex justify-content-around flex-wrap gap-3">
          {buttons.map((btn) => (
            <button
              key={btn.id}
              className="btn btn-outline-dark d-flex flex-column align-items-center px-4 py-3"
              onClick={() => handleClick(btn)}
              style={{ minWidth: '100px' }}
            >
              <span style={{ fontSize: '1.5rem' }}>{btn.icon}</span>
              <span className="mt-1 small">{btn.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ButtonsDashboardWidget;