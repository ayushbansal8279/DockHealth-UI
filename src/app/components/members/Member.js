import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ButtonBase from '@material-ui/core/ButtonBase';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';

export const StyledAvatar = styled(Avatar).attrs({ classes: { img: 'img' } })`
  && {
    width: 55px;
    height: 55px;
    font-size: 16px;
    font-weight: bold;
    background: ${({ color }) => color || 'white'};
    box-sizing: border-box;

    border: 2px solid ${({ color }) => color || '#00a73c'};
    padding: 3px;
    color: white;
  }

  & .img {
    border-radius: 50%;
    box-sizing: border-box;
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

const getThumbnailUrl = ({ userId, profileThumbnailPictureHash }) =>
  `${
    process.env.HEYDOC_SERVICES_BASE_URL
  }user/profilePicture/${userId}/${profileThumbnailPictureHash}`;

const Member = ({ onClick, member, children, className, style, color }) => {
  const alt = member && `${member.firstName} ${member.lastName}`;
  const src =
    member && member.profileThumbnailPictureHash && getThumbnailUrl(member);
  const memberColor = member && (src ? undefined : member.bubbleColor || '#00a73c');

  const avatarProps = {
    alt,
    src,
    color: color || memberColor,
  };

  const avatar = (
    <StyledAvatar {...avatarProps} className={className}>
      {children || (!member.profileThumbnailPictureHash && member.initials)}
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
    return <Tooltip title={avatarProps.alt}>{containedAvatar}</Tooltip>;
  }

  return containedAvatar;
};

Member.propTypes = {
  onClick: PropTypes.func,
  member: PropTypes.shape({
    userId: PropTypes.number,
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
