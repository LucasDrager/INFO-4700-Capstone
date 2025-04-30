import React from 'react';
import treeVideo from '../../assets/videos/treegrowth.mp4';

const PlantContainerWidget = () => {
  return (
    <div className="sidebar-plant">
      <video
        style={{
          position: 'absolute',
          bottom: '1.5625rem',
          width: '15rem',
          height: '20rem',
          margin: 'auto',
          objectFit: 'cover',
          left: '0.1rem'
        }}
        autoPlay
        muted
        playsInline
      >
        <source src={treeVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default PlantContainerWidget;