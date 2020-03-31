import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import useBoolean from '../../hooks/useBoolean';
import palette from '../../palette';
import { MontserratTypography } from '../../theme-montserrat';
import Avatar from '../common/Avatar';
import UniversalTooltip from '../common/UniversalTooltip';

const getThumbnailUrl = ({ userIdentifier, profileThumbnailPictureHash }) =>
  `${process.env.HEYDOC_SERVICES_BASE_URL}user/profilePicture/${userIdentifier}/${profileThumbnailPictureHash}`;

const Member = React.forwardRef(
  (
    { onClick, member, children, className, color, size, showTooltip = true },
    reference,
  ) => {
    const alt = member && `${member.firstName} ${member.lastName}`;
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

    const avatar = (
      <Avatar
        ref={reference}
        size={size ?? 55}
        color={color || memberColor}
        className={className}
        onClick={onClick}
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

export default Member;
