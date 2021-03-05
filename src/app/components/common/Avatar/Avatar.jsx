import { omit } from 'ramda';
import React from 'react';
import palette from 'styles/palette';
import {
  AvatarContainer,
  InnerAvatarContainer,
  OnlineIndicator,
  OfflineIndicator,
  IdleIndicator,
  BackgroundContainer,
} from './styled';

const Avatar = React.forwardRef(
  (
    {
      children,
      size,
      isOnline,
      isOffline,
      isIdle,
      isInactive,
      padded = true,
      color = palette.midnightBlue,
      showOnlineIndicator = true,
      ...props
    },
    reference,
  ) => (
    <BackgroundContainer>
      <AvatarContainer
        ref={reference}
        size={size}
        color={color}
        isInactive={isInactive}
        {...omit(['ref'], props)}
      >
        <InnerAvatarContainer color={color} size={size} padded={padded}>
          {children}
        </InnerAvatarContainer>
        {showOnlineIndicator && (
          <>
            {isOnline && <OnlineIndicator />}
            {isOffline && <OfflineIndicator />}
            {isIdle && <IdleIndicator />}
          </>
        )}
      </AvatarContainer>
    </BackgroundContainer>
  ),
);

export default Avatar;
