import { omit } from 'ramda';
import React from 'react';
import CameraIcon from '../../img/camera.svg';
import palette from '../../palette';
import {
  AvatarContainer,
  CameraContainer,
  InnerAvatarContainer,
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
      color = palette.midnightBlue,
      padded = true,
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
      {...omit(['ref'], props)}
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
  ),
);
