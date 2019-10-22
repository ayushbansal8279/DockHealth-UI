import React from 'react';
import { useSelector } from 'react-redux';
import { AvatarContainer } from './UserProfileView.Styled';

export default () => {
  const userProfilePic = useSelector(state => state.userState.userProfilePic);

  return <AvatarContainer>TBA</AvatarContainer>;
};
