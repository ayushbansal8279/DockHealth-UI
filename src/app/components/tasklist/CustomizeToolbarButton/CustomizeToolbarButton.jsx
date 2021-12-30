import React from 'react';
import viewTypeIcon from 'img/viewTypeIcon.png';
import ToolbarButton from '../ToolbarButton/ToolbarButton';

const CustomizeToolbarButton = ({ onChange, openCustomFieldModal }) => {
  return (
    <ToolbarButton
      name="customize"
      buttonText="Customize"
      onChange={onChange}
      icon={<img src={viewTypeIcon} alt="view type icon" />}
      addCustomFieldClick={openCustomFieldModal}
    />
  );
};

export default CustomizeToolbarButton;
