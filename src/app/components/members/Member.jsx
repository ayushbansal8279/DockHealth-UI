import { Avatar, ButtonBase } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import styled from 'styled-components';
import useBoolean from '../../hooks/useBoolean';
import palette from '../../palette';
import { MontserratTypography } from '../../theme-montserrat';
import UniversalTooltip from '../common/UniversalTooltip';

export const StyledAvatar = styled(Avatar).attrs({ classes: { img: 'img' } })`
  && {
    width: 55px;
    height: 55px;
    font-size: 16px;
    font-weight: bold;
    background: ${({ color }) => color || palette.white};
    box-sizing: border-box;

    border: 2px solid ${({ color }) => color || palette.memberGreen};
    padding: 3px;
    color: white;
  }

  & .img {
    border-radius: 50%;
    box-sizing: border-box;
    object-fit: contain;
    object-position: center;
  }

  :before {
    content: ' ';
    position: absolute;
    border: 3px solid white;
    border-radius: 50%;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
`;

const StyledButtonBase = styled(ButtonBase)`
  && {
    border-radius: 50%;
  }
`;

const StyledContainer = styled.div`
  display: inline-flex;
`;

const getThumbnailUrl = ({ userIdentifier, profileThumbnailPictureHash }) =>
  `${process.env.HEYDOC_SERVICES_BASE_URL}user/profilePicture/${userIdentifier}/${profileThumbnailPictureHash}`;

const Member = ({ onClick, member, children, className, style, color }) => {
  const alt = member && `${member.firstName} ${member.lastName}`;
  const source = member?.profileThumbnailPictureHash && getThumbnailUrl(member);
  const memberColor = member?.bubbleColor || palette.memberGreen;

  const avatarContainerReference = useRef(null);
  const [
    isAvatarTooltipOpen,
    showAvatarTooltip,
    hideAvatarTooltip,
  ] = useBoolean(false);

  const avatarProps = {
    alt,
    src: source,
    color: color || memberColor,
  };

  const avatar = (
    <StyledAvatar {...avatarProps} className={className}>
      {children ||
        (member && !member.profileThumbnailPictureHash && (
          <MontserratTypography variant="h4" weight="bold">
            {member.initials?.toLowerCase()}
          </MontserratTypography>
        ))}
    </StyledAvatar>
  );

  const containedAvatar = onClick ? (
    <StyledButtonBase onClick={onClick} style={style}>
      {avatar}
    </StyledButtonBase>
  ) : (
    <StyledContainer>{avatar}</StyledContainer>
  );

  if (avatarProps.alt) {
    return (
      <>
        <div
          ref={avatarContainerReference}
          onMouseEnter={showAvatarTooltip}
          onMouseLeave={hideAvatarTooltip}
        >
          {containedAvatar}
        </div>
        <UniversalTooltip
          open={isAvatarTooltipOpen}
          placement="bottom"
          anchorEl={avatarContainerReference.current}
        >
          {avatarProps.alt}
        </UniversalTooltip>
      </>
    );
  }

  return containedAvatar;
};

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
