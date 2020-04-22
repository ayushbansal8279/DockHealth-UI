import React from 'react';
import PropTypes from 'prop-types';
import ProfileIcon from 'img/profile.svg';
import palette from 'styles/palette';
import Member from './Member';

const MemberAssignment = ({ member, onClick, disabled, large }) =>
  member ? (
    <Member
      onClick={disabled ? undefined : onClick}
      member={member}
      large={large}
    />
  ) : (
    <Member
      onClick={disabled ? undefined : onClick}
      alt="Unassigned"
      large={large}
      color={palette.unknownGrey6}
    >
      <img src={ProfileIcon} alt="Unassigned" style={{ marginBottom: '3px' }} />
    </Member>
  );

MemberAssignment.propTypes = {
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  member: PropTypes.shape({
    userIdentifier: PropTypes.string,
    profileThumbnailPictureHash: PropTypes.string,
    initials: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  }),
};

MemberAssignment.defaultProps = {
  disabled: false,
  member: null,
  onClick: null,
};

export default MemberAssignment;
