import React from 'react';
import { useSelector } from 'react-redux';
import CameraIcon from '../../img/camera.svg';

import {
  AvatarContainer,
  AvatarImageContainer,
  CameraContainer,
  InnerAvatarContainer,
} from './UserProfileView.Styled';

export default () => {
  const userProfile = useSelector(state => state.userState.userProfile);
  const userProfilePic = useSelector(state => state.userState.userProfilePic);

  const avatarInitials = userProfile
    ? `${userProfile.firstName[0]}${userProfile.lastName[0]}`.trim()
    : '';

  const avatarContent = userProfilePic ? (
    <AvatarImageContainer src={userProfilePic} alt="User profile picture" />
  ) : (
    avatarInitials
  );

  return (
    <AvatarContainer>
      <InnerAvatarContainer>{avatarContent}</InnerAvatarContainer>
      <CameraContainer>
        <img src={CameraIcon} alt="Camera" />
      </CameraContainer>
    </AvatarContainer>
  );
};
