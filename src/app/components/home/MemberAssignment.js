import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Member from './Member';
import ProfileIcon from '../../img/profile.svg';

const UnassignedText = styled.div`
  font-size: 26px;
  font-weight: bolder;
  color: white;
`;

const MemberAssignment = ({
  member, onClick, disabled, large,
}) => (
  member
    ? <Member onClick={disabled ? undefined : onClick} member={member} large={large} />
    : (
      <Member onClick={disabled ? undefined : onClick} alt="Unassigned" large={large} color="#DEDEE2">
        <img src={ProfileIcon} alt="Unassigned" style={{ marginBottom: '3px' }} />
      </Member>
    )
);

MemberAssignment.propTypes = {
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  member: PropTypes.shape({
    userId: PropTypes.number,
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
