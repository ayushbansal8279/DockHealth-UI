import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import { connect } from 'react-redux';
import { isEmpty } from 'ramda';
import useBoolean from 'hooks/useBoolean';
import palette from 'styles/palette';
import { MontserratTypography } from 'styles/theme-montserrat';
import { getMemberStatus } from 'helpers/list-members-helper';
import Avatar from 'components/common/Avatar';
import UniversalTooltip from 'components/common/UniversalTooltip';
import { TooltipName, TooltipStatus } from './styled';

const getThumbnailUrl = ({ userIdentifier, profileThumbnailPictureHash }) =>
  `${process.env.HEYDOC_SERVICES_BASE_URL}user/profilePicture/${userIdentifier}/${profileThumbnailPictureHash}`;

const Member = React.forwardRef(
  (
    {
      onClick,
      member,
      children,
      className,
      color,
      size,
      showTooltip = true,
      activeUsersList,
      idleUsersList,
    },
    reference,
  ) => {
    const status = getMemberStatus(member);
    const alt = member ? (
      <div>
        <TooltipName>{`${member.firstName} ${member.lastName}`}</TooltipName>
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
    const memberColor = member?.bubbleColor || palette.memberGreen;

    const avatarContainerReference = useRef(null);
    const [
      isAvatarTooltipOpen,
      showAvatarTooltip,
      hideAvatarTooltip,
    ] = useBoolean(false);

    const onlineActiveUser =
      activeUsersList?.find(({ userIdentifier }) => {
        return userIdentifier === member?.userIdentifier;
      }) || {};
    const onlineIdleUser =
      idleUsersList?.find(({ userIdentifier }) => {
        return userIdentifier === member?.userIdentifier;
      }) || {};

    const currentUserIdentifier = sessionStorage.getItem('userIdentifier');

    const avatar = (
      <Avatar
        ref={reference}
        size={size ?? 55}
        color={color || memberColor}
        className={className}
        onClick={onClick}
        showOnlineIndicator={currentUserIdentifier !== member?.userIdentifier}
        isOnline={!isEmpty(onlineActiveUser)}
        isOffline={isEmpty(onlineActiveUser) && isEmpty(onlineIdleUser)}
        isIdle={!isEmpty(onlineIdleUser)}
      >
        {children || avatarContent}
      </Avatar>
    );

    if (showTooltip && alt) {
      return (
        <>
          <div
            ref={avatarContainerReference}
            onMouseEnter={showAvatarTooltip}
            onMouseLeave={hideAvatarTooltip}
          >
            {avatar}
          </div>
          <UniversalTooltip
            open={isAvatarTooltipOpen}
            placement="bottom"
            anchorEl={avatarContainerReference.current}
          >
            {alt}
          </UniversalTooltip>
        </>
      );
    }

    return avatar;
  },
);

Member.propTypes = {
  onClick: PropTypes.func,
  member: PropTypes.shape({
    userIdentifier: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    initials: PropTypes.string,
    profileThumbnailPictureHash: PropTypes.string,
  }),
};

Member.defaultProps = {
  member: null,
  onClick: null,
};

const mapStateToProps = state => ({
  activeUsersList: state.activeUsers.activeUsersList,
  idleUsersList: state.activeUsers.idleUsersList,
});

export default connect(mapStateToProps)(Member);
