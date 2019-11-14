import React from 'react';

import CameraIcon from '../../img/camera.svg';
import {
  AvatarContainer,
  CameraContainer,
  InnerAvatarContainer,
} from './Avatar.styled';

export default ({
  avatarRef,
  children,
  onClick,
  size,
  withCameraIcon,
  withCursor,
  withShadow,
}) => (
  <AvatarContainer
    onClick={onClick}
    ref={avatarRef}
    size={size}
    withCursor={withCursor}
    withShadow={withShadow}
  >
    <InnerAvatarContainer size={size}>{children}</InnerAvatarContainer>
    {withCameraIcon && (
      <CameraContainer size={size}>
        <img src={CameraIcon} alt="Camera icon" />
      </CameraContainer>
    )}
  </AvatarContainer>
);
