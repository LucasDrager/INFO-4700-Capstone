//this is the widget container for the settings menu (literal actual settings. this shuold be the largest widget on the page. )

import React from 'react';

const SettingsWidget = () => {
  return (
    <div className="SW-Container">

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
