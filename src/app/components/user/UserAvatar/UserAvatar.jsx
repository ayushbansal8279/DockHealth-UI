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
  UserOrganizationRole,
} from 'helpers/user-helper';
import ExternalIcon from 'img/external.svg';
import Avatar from '../Avatar/Avatar';
import { TooltipContent } from './styled';

const UserAvatar = React.forwardRef(
  ({ user, color, size, isSelected, hideTooltip, onClick }, reference) => {
    const activeUsersList = useSelector(activeUsersListSelector);
    const { name, initials, bubbleColor, userStatus, orgUserRole } = user || {};
    const isExternal = orgUserRole === UserOrganizationRole.EXTERNAL;
    const isGuest = orgUserRole === UserOrganizationRole.GUEST;

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

    const pictureSource = useMemo(() => {
      if (isExternal || isGuest) return ExternalIcon;
      return !!size && size > 100
        ? getUserAvatarUrl(user)
        : getUserAvatarThumbnailUrl(user);
    }, [isExternal, isGuest, size, user]);

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
