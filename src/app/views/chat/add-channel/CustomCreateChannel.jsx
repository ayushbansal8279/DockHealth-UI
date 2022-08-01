import React from 'react';
import CustomInviteUsers from './CustomInviteUsers';

const CustomCreateChannel = props => {
  const { onCancel } = props;

  return <CustomInviteUsers onCancel={onCancel} />;
};

export default CustomCreateChannel;
