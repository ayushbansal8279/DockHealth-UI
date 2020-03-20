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
  color = '#3d4858',
  padded = true,
}) => (
  <AvatarContainer
    onClick={onClick}
    ref={avatarRef}
    size={size}
    withCursor={withCursor}
    withShadow={withShadow}
    color={color}
  >
    <InnerAvatarContainer color={color} size={size} padded={padded}>
      {children}
    </InnerAvatarContainer>
    {withCameraIcon && (
      <CameraContainer size={size}>
        <img src={CameraIcon} alt="Camera icon" />
      </CameraContainer>
    )}
  </AvatarContainer>
);
