import { bool, number, string, shape, func } from 'prop-types';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { activeUsersListSelector } from 'selectors/active-users-selector';
import Tooltip from 'components/common/Tooltip/Tooltip';
import { Box } from '@mui/material';
import { isNotEmptyArray } from 'helpers/utils-helpers';
import { ActivityStatus } from 'helpers/user-helper';
import {
  getGroupActivityStatus,
  getUserGroupAvatarThumbnailUrl,
} from 'helpers/user-groups-helper';
import Avatar from '../Avatar/Avatar';
import { TooltipContent, UserName, MoreText } from './styled';

const GroupAvatar = React.forwardRef(
  (
    {
      group,
      size,
      isSelected,
      hideTooltip,
      hideStatus,
      onClick,
      displayUsersCount = 30,
      isListPage,
    },
    reference,
  ) => {
    const activeUsersList = useSelector(activeUsersListSelector);
    const { name, initials, bubbleColor, users } = group || {};

    const activityStatus = useMemo(
      () =>
        hideStatus || !group
          ? null
          : getGroupActivityStatus(group, activeUsersList),
      [hideStatus, group, activeUsersList],
    );

    const pictureSource = useMemo(
      () => getUserGroupAvatarThumbnailUrl(group),
      [group],
    );

    return (
      <>
        <Tooltip
          title={
            <TooltipContent>
              <b>{name}</b>
              {activityStatus && (
                <Box>
                  {activityStatus === ActivityStatus.ONLINE && 'online'}
                  {activityStatus === ActivityStatus.IDLE && 'idle'}
                  {activityStatus === ActivityStatus.OFFLINE && 'offline'}
                </Box>
              )}
              {isNotEmptyArray(users) && (
                <Box mt={2}>
                  {[...users]?.splice(0, displayUsersCount).map((u) => (
                    <UserName key={u.identifier}>{u?.name}</UserName>
                  ))}
                  {users?.length > displayUsersCount && (
                    <MoreText>{`${
                      users?.length - displayUsersCount
                    } more...`}</MoreText>
                  )}
                </Box>
              )}
            </TooltipContent>
          }
          placement="bottom"
          hideTooltip={hideTooltip}
        >
          <Avatar
            isGroup
            ref={reference}
            pictureSrc={pictureSource}
            initials={initials}
            isSelected={isSelected}
            name={name}
            activityStatus={
               activityStatus === ActivityStatus.ONLINE
                ? activityStatus
                : ''
            }
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
