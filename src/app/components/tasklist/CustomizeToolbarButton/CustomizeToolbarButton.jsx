import React from 'react';
import viewTypeIcon from 'img/viewTypeIcon.png';
import ToolbarButton from '../ToolbarButton/ToolbarButton';

const CustomizeToolbarButton = ({ onChange }) => {
  return (
    <ToolbarButton
      name="customize"
      buttonText="Customize"
      onChange={onChange}
      icon={<img src={viewTypeIcon} alt="view type icon" />}
    />
  );
};

export default CustomizeToolbarButton;
