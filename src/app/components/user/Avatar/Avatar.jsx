import { bool, number, string, func, oneOf } from 'prop-types';
import React, { useMemo } from 'react';
import { omit } from 'ramda';
import palette from 'styles/palette';
import { ActivityStatus } from 'helpers/user-helper';
import {
  TooltipName,
  MemberImage,
  BackgroundContainer,
  AvatarContainer,
  InnerAvatarContainer,
  OnlineIndicator,
  OfflineIndicator,
  IdleIndicator,
} from './styled';

const Avatar = React.forwardRef(
  (
    {
      initials,
      pictureSrc,
      name,
      color,
      size,
      isBlurred,
      onClick,
      activityStatus,
      isSelected,
      ...props
    },
    reference,
  ) => {
    const isOnline = activityStatus === ActivityStatus.ONLINE;
    const isIdle = activityStatus === ActivityStatus.IDLE;
    const isOffline = activityStatus === ActivityStatus.OFFLINE;

    const isOnClickFunction = typeof onClick === 'function';

    const avatarContent = useMemo(() => {
      if (pictureSrc) {
        const alt = (
          <div>
            <TooltipName>{`${name}`?.slice(0, 18)}</TooltipName>
          </div>
        );

        return <MemberImage src={pictureSrc} alt={alt} />;
      }
      return initials?.toLowerCase();
    }, [pictureSrc, initials, name]);

    return (
      <BackgroundContainer
        onClick={event => {
          if (isOnClickFunction) onClick(event);
        }}
      >
        <AvatarContainer
          ref={reference}
          clickable={isOnClickFunction}
          isSelected={isSelected}
          size={size}
          color={color}
          isBlurred={isBlurred}
          {...omit(['ref'], props)}
        >
          <InnerAvatarContainer color={color} size={size}>
            {avatarContent}
          </InnerAvatarContainer>
          {activityStatus && (
            <>
              {isOnline && <OnlineIndicator />}
              {isOffline && <OfflineIndicator />}
              {isIdle && <IdleIndicator />}
            </>
          )}
        </AvatarContainer>
      </BackgroundContainer>
    );
  },
);

Avatar.propTypes = {
  initials: string,
  name: string,
  pictureSrc: string,
  activityStatus: oneOf(Object.values(ActivityStatus)),
  size: number,
  isSelected: bool,
  isBlurred: bool,
  color: string,
  onClick: func,
};

Avatar.defaultProps = {
  initials: undefined,
  name: undefined,
  pictureSrc: null,
  activityStatus: null,
  size: 30,
  isBlurred: false,
  isSelected: false,
  color: palette.coolGrey2,
  onClick: null,
};

export default Avatar;
