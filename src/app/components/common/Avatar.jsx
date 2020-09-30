import { omit } from 'ramda';
import React from 'react';
import CameraIcon from 'img/camera.svg';
import palette from 'styles/palette';
import {
  AvatarContainer,
  CameraContainer,
  InnerAvatarContainer,
  OnlineIndicator,
  OfflineIndicator,
  IdleIndicator,
} from './Avatar.styled';

export default React.forwardRef(
  (
    {
      children,
      onClick,
      size,
      withCameraIcon,
      withCursor,
      withShadow,
      showOnlineIndicator,
      isOnline,
      isOffline,
      isIdle,
      color = palette.midnightBlue,
      padded = true,
      isInactive,
      ...props
    },
    reference,
  ) => (
    <AvatarContainer
      onClick={onClick}
      ref={reference}
      size={size}
      withCursor={withCursor}
      withShadow={withShadow}
      color={color}
      isInactive={isInactive}
      {...omit(['ref'], props)}
    >
      <InnerAvatarContainer color={color} size={size} padded={padded}>
        {children}
      </InnerAvatarContainer>
      {withCameraIcon && !showOnlineIndicator && (
        <CameraContainer size={size}>
          <img src={CameraIcon} alt="Camera icon" />
        </CameraContainer>
      )}
      {showOnlineIndicator && isOnline && !withCameraIcon && (
        <OnlineIndicator />
      )}
      {showOnlineIndicator && isOffline && !withCameraIcon && (
        <OfflineIndicator />
      )}
      {showOnlineIndicator && isIdle && !withCameraIcon && <IdleIndicator />}
    </AvatarContainer>
  ),
);
