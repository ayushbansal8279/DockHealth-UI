import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Member from './Member';
import ProfileIcon from '../../img/profile.svg';

const AssignedMember = styled(Member)`
  && {
    margin: 0 auto;
    width: 41px;
    height: 41px;
    font-size: 12px;
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
      color="#DEDEE2"
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
