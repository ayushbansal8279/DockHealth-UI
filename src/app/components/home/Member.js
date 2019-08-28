import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ButtonBase from '@material-ui/core/ButtonBase';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';

export const StyledAvatar = styled(Avatar).attrs({ classes: { img: 'img' } })`
  && {
    width: 31px;
    height: 31px;
    font-size: 12px;
    background: ${({ color }) => color};
  }

  & .img {
    border: 1px solid #0ca1c7;
    border-radius: 50%;
    padding: 2px;
    background: #fff;
  }
`;

StyledAvatar.defaultProps = {
  color: '#00a73c',
};

const StyledButtonBase = styled(ButtonBase)`
  && {
    border-radius: 50%;
  }
`;

const StyledContainer = styled.div`
  display: inline-flex;
`;

const getThumbnailUrl = ({ userId, profileThumbnailPictureHash }) => (
  `${process.env.HEYDOC_SERVICES_BASE_URL}user/profilePicture/${userId}/${profileThumbnailPictureHash}`
);

const Member = ({
  onClick,
  member,
  children,
  color,
  className,
  style,
}) => {
  const avatarProps = {
    alt: member && `${member.firstName} ${member.lastName}`,
    src: member && member.profileThumbnailPictureHash && getThumbnailUrl(member),
    color,
  };

  const avatar = (
    <StyledAvatar {...avatarProps} className={className}>
      {children || (!member.profileThumbnailPictureHash && member.initials)}
    </StyledAvatar>
  );

  const containedAvatar = onClick
    ? <StyledButtonBase onClick={onClick} style={style}>{avatar}</StyledButtonBase>
    : <StyledContainer>{avatar}</StyledContainer>;

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
