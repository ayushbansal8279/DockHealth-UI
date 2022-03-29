import { bool, number, string, shape, func, oneOf } from 'prop-types';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import ExternalUserIcon from 'img/external-user-icon';
import { activeUsersListSelector } from 'selectors/active-users-selector';
import Tooltip from 'components/common/Tooltip/Tooltip';
import {
  UserStatus,
  ActivityStatus,
  getUserActivityStatus,
  getUserAvatarThumbnailUrl,
  getUserAvatarUrl,
} from 'helpers/user-helper';
import Avatar from '../Avatar/Avatar';
import { TooltipContent } from './styled';

const UserAvatar = React.forwardRef(
  ({ user, color, size, isSelected, hideTooltip, onClick }, reference) => {
    const activeUsersList = useSelector(activeUsersListSelector);
    const { name, initials, bubbleColor, userStatus } = user;

    const isInactive = useMemo(
      () =>
        [UserStatus.PENDING, UserStatus.INVITED, UserStatus.INACTIVE].includes(
          userStatus,
        ),
      [userStatus],
    );

    const activityStatus = useMemo(() => {
      if (isInactive) {
        return undefined;
      }
      return getUserActivityStatus(user, activeUsersList);
    }, [activeUsersList, isInactive, user]);

    const { source: pictureSource, size: pictureSize } = useMemo(() => {
      // TODO: use backend external flag
      if (user.external) return { source: ExternalUserIcon, size: 0.5 * size };

      return {
        source:
          !!size && size > 100
            ? getUserAvatarUrl(user)
            : getUserAvatarThumbnailUrl(user),
      };
    }, [size, user]);

    return (
      <>
        <Tooltip
          title={
            <TooltipContent>
              <b>{name}</b>
              <div>
                {activityStatus === ActivityStatus.ONLINE && 'online'}
                {activityStatus === ActivityStatus.IDLE && 'idle'}
                {activityStatus === ActivityStatus.OFFLINE && 'offline'}
                {!activityStatus &&
                  userStatus === UserStatus.INVITED &&
                  'invite pending'}
              </div>
            </TooltipContent>
          }
          placement="bottom"
          hideTooltip={hideTooltip}
        >
          <Avatar
            ref={reference}
            initials={initials}
            isSelected={isSelected}
            pictureSrc={pictureSource}
            pictureSize={pictureSize}
            name={name}
            activityStatus={activityStatus}
            isBlurred={isInactive}
            color={color || bubbleColor}
            size={size}
            onClick={onClick}
          />
        </Tooltip>
      </>
    );
  },
);

UserAvatar.propTypes = {
  user: shape({
    userIdentifier: string,
    name: string,
    bubbleColor: string,
    initials: string,
    profileThumbnailPictureHash: string,
    userStatus: oneOf(Object.values(UserStatus)),
  }).isRequired,
  hideTooltip: bool,
  size: number,
  color: string,
  onClick: func,
};

UserAvatar.defaultProps = {
  hideTooltip: false,
  size: undefined,
  color: undefined,
  onClick: null,
};

export default UserAvatar;
