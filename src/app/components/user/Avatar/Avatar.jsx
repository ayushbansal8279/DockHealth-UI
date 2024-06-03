import { bool, number, string, func, oneOf } from 'prop-types';
import React, { useMemo } from 'react';
import omit from 'ramda/src/omit';
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
      pictureSize = '100%',
      name,
      color,
      size,
      isBlurred,
      onClick,
      activityStatus,
      isSelected,
      isGroup,
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

        return (
          <MemberImage src={pictureSrc} pictureSize={pictureSize} alt={alt} />
        );
      }
      return isGroup ? initials?.[0]?.toUpperCase() : initials?.toLowerCase();
    }, [pictureSrc, isGroup, initials, name, pictureSize]);

    return (
      <BackgroundContainer
        onClick={(event) => {
          if (isOnClickFunction) onClick(event);
        }}
      >
        <AvatarContainer
          ref={reference}
          clickable={isOnClickFunction}
          isSelected={isSelected}
          size={size}
          color={color}
          isGroup={isGroup}
          isBlurred={isBlurred}
          {...omit(['ref'], props)}
        >
          <InnerAvatarContainer
            color={color}
            size={size}
            isGroup={isGroup}
            isSelected={isSelected}
          >
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
  activityStatus: ActivityStatus.OFFLINE,
  size: 30,
  isBlurred: false,
  isSelected: false,
  color: palette.coolGrey2,
  onClick: null,
};

export default Avatar;
