import PropTypes, { bool, number } from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { isEmpty } from 'ramda';
import { MontserratTypography } from 'styles/theme-montserrat';
import { getMemberStatus } from 'helpers/list-members-helper';
import Avatar from 'components/common/Avatar/Avatar';
import Tooltip from 'components/common/Tooltip/Tooltip';
import { TooltipName, TooltipStatus, TooltipContent } from './styled';

const getThumbnailUrl = ({ userIdentifier, profileThumbnailPictureHash }) =>
  `${process.env.HEYDOC_SERVICES_BASE_URL}user/profilePicture/${userIdentifier}/${profileThumbnailPictureHash}`;

const Member = React.forwardRef(
  (
    {
      member,
      children,
      className,
      color,
      size,
      showTooltip,
      isInactive,
      activeUsersList,
    },
    reference,
    // eslint-disable-next-line sonarjs/cognitive-complexity
  ) => {
    const status = getMemberStatus(member);
    const alt = member ? (
      <div>
        <TooltipName>
          {`${member.firstName} ${member.lastName}`?.slice(0, 18)}
        </TooltipName>
        {status && <TooltipStatus>{status}</TooltipStatus>}
      </div>
    ) : null;

    const avatarContent = member?.profileThumbnailPictureHash ? (
      <img src={getThumbnailUrl(member)} alt={alt} />
    ) : (
      <MontserratTypography variant="h4" weight="bold">
        {member?.initials?.toLowerCase()}
      </MontserratTypography>
    );

    const onlineActiveUser =
      activeUsersList?.find(({ userIdentifier }) => {
        return userIdentifier === member?.userIdentifier;
      }) || {};

    const isOnline = !isEmpty(onlineActiveUser) && !onlineActiveUser.idle;
    const isIdle = !isEmpty(onlineActiveUser) && onlineActiveUser.idle;
    const isOffline =
      member?.userStatus !== 'INVITED' && isEmpty(onlineActiveUser);
    const isInvited =
      member?.userStatus === 'INVITED' && isEmpty(onlineActiveUser);

    return (
      <>
        <Tooltip
          title={
            <TooltipContent>
              <b>{member?.userName}</b>
              <div>
                {isOnline && 'online'}
                {isIdle && 'idle'}
                {isOffline && 'offline'}
                {isInvited && 'invite pending'}
              </div>
            </TooltipContent>
          }
          placement="bottom"
          hideTooltip={!showTooltip}
        >
          <Avatar
            ref={reference}
            size={size}
            color={color || member?.bubbleColor}
            className={className}
            isInactive={isInactive || isInvited}
            isOnline={isOnline}
            isIdle={isIdle}
            isOffline={isOffline}
          >
            {children || avatarContent}
          </Avatar>
        </Tooltip>
      </>
    );
  },
);

Member.propTypes = {
  showTooltip: bool,
  size: number,
  member: PropTypes.shape({
    userIdentifier: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    initials: PropTypes.string,
    profileThumbnailPictureHash: PropTypes.string,
  }),
};

Member.defaultProps = {
  showTooltip: true,
  size: 30,
  member: null,
};

const mapStateToProps = state => ({
  activeUsersList: state.activeUsers.activeUsersList,
});

export default connect(mapStateToProps)(Member);
