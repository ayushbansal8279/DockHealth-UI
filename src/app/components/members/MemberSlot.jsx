import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import ProfileIcon from '../../img/profile.svg';
import palette from '../../palette';
import Member from './Member';

const AssignedMember = styled(Member)`
  && {
    margin: 0 auto;
    width: 41px;
    height: 41px;
    font-size: 1rem;
  }
`;

const MemberSlot = ({ member, onClick, small }) =>
  member ? (
    <AssignedMember onClick={onClick} member={member} small={small} />
  ) : (
    <AssignedMember
      onClick={onClick}
      alt="Unassigned"
      small={small}
      color={palette.unknownGrey6}
    >
      <img
        src={ProfileIcon}
        alt="Unassigned"
        style={{ marginBottom: '3px', width: '19px' }}
      />
    </AssignedMember>
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
