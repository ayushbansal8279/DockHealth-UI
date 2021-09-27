import { bool, number, string, shape, func } from 'prop-types';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { activeUsersListSelector } from 'selectors/active-users-selector';
import Tooltip from 'components/common/Tooltip/Tooltip';
import { ActivityStatus } from 'helpers/user-helper';
import {
  getGroupActivityStatus,
  getUserGroupAvatarThumbnailUrl,
} from 'helpers/user-groups-helper';
import Avatar from '../Avatar/Avatar';
import { TooltipContent } from './styled';

const GroupAvatar = React.forwardRef(
  (
    { group, size, isSelected, hideTooltip, hideStatus, onClick },
    reference,
  ) => {
    const activeUsersList = useSelector(activeUsersListSelector);
    const { name, initials, bubbleColor } = group || {};

    const activityStatus = useMemo(
      () =>
        hideStatus || !group
          ? null
          : getGroupActivityStatus(group, activeUsersList),
      [hideStatus, group, activeUsersList],
    );

    const pictureSource = useMemo(() => getUserGroupAvatarThumbnailUrl(group), [
      group,
    ]);

    return (
      <>
        <Tooltip
          title={
            <TooltipContent>
              <b>{name}</b>
              {activityStatus && (
                <div>
                  {activityStatus === ActivityStatus.ONLINE && 'online'}
                  {activityStatus === ActivityStatus.IDLE && 'idle'}
                  {activityStatus === ActivityStatus.OFFLINE && 'offline'}
                </div>
              )}
            </TooltipContent>
          }
          placement="bottom"
          hideTooltip={hideTooltip}
        >
          <Avatar
            ref={reference}
            pictureSrc={pictureSource}
            initials={initials}
            isSelected={isSelected}
            name={name}
            activityStatus={activityStatus}
            color={bubbleColor}
            size={size}
            onClick={onClick}
          />
        </Tooltip>
      </>
    );
  },
);

GroupAvatar.propTypes = {
  group: shape({
    identifier: string.isRequired,
    name: string.isRequired,
    bubbleColor: string.isRequired,
    initials: string.isRequired,
  }).isRequired,
  hideTooltip: bool,
  hideStatus: bool,
  size: number,
  onClick: func,
};

GroupAvatar.defaultProps = {
  hideTooltip: false,
  hideStatus: false,
  size: undefined,
  onClick: null,
};

export default GroupAvatar;
