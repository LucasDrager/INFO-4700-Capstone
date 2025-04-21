//this is the widget container for the settings menu (literal actual settings. this shuold be the largest widget on the page. )

import React, { useContext } from 'react';
import { ThemeContext } from '../../ThemeContext';


const SettingsWidget = () => {

  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <div className="SW-Container">
      {/* Toggle Button */}
      <button className="SW-ToggleButton" onClick={toggleTheme}>
        Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
      </button>

      <div className="SW-Left">
        <div className="SW-SquareWidget">Square Widget 1</div>
        <div className="SW-TallWidget">Tall Widget 1</div>
      </div>
      <div className="SW-Left">
        <div className="SW-SquareWidget">Square Widget 1</div>
        <div className="SW-TallWidget">Tall Widget 1</div>
      </div>

    </div>
  );
};

export default SettingsWidget;
