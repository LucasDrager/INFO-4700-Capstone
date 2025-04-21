import React from 'react';
import treeNoLeavesTest from '../common-components/ReactiveTree/TREEBASE.png';

const imageMap = {
  healthy: treeNoLeavesTest,
  // add further states/images if needed
};

const PlantContainerWidget = ({ plantState }) => {
  const backgroundImage = imageMap[plantState] || imageMap.healthy;

  return (
    <div
      className="sidebar-plant"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'absolute',
        bottom: '1.5625rem',
        width: '15.625rem',
        height: '24.375rem',
        margin: '0 1.5625rem',
        overflow: 'hidden',
        backgroundRepeat: 'no-repeat',
      }}
    ></div>
  );
};

export default PlantContainerWidget;