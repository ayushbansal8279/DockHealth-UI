import PropTypes from 'prop-types';
import React from 'react';
import ProfileIcon from 'img/profile.svg';
import palette from 'styles/palette';
import Member from './Member';

const MemberSlot = ({ member, onClick, size }) =>
  member ? (
    <Member size={size ?? 40} onClick={onClick} member={member} />
  ) : (
    <Member
      size={size ?? 40}
      onClick={onClick}
      alt="Unassigned"
      color={palette.unknownGrey6}
    >
      <img src={ProfileIcon} alt="Unassigned" style={{ width: '60%' }} />
    </Member>
  );

MemberSlot.propTypes = {
  onClick: PropTypes.func,
  member: PropTypes.shape({
    userIdentifier: PropTypes.string,
    profileThumbnailPictureHash: PropTypes.string,
    initials: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  }),
};

MemberSlot.defaultProps = {
  member: null,
  onClick: null,
};

export default MemberSlot;
