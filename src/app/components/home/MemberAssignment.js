import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Member from './Member';

const AssignedMember = styled(Member)`
  && {
    margin: 0 auto;
    width: 41px;
    height: 41px;
    font-size: 16px;
  }

  & .img {
    ${({ small }) => (small
    ? `border: 1px solid #0ca1c7;
        padding: 2px;`
    : `border: 2px solid #0ca1c7;
        padding: 3px;`)}
  }
`;

const UnassignedMember = styled(AssignedMember)`
  && {
    background: #fff;
    border-radius: 50%;
    ${({ small }) => (small
    ? `border: 1px solid #0ca1c7;
        padding: 2px;`
    : `border: 2px solid #0ca1c7;
        padding: 3px;`)}
  
    :before {
      content: " ";
      position: absolute;
      border: 1px solid #aab8c3;
      border-radius: 50%;
      ${({ small }) => (small
    ? `top: 2px;
        bottom: 2px;
        left: 2px;
        right: 2px;`
    : `top: 3px;
        bottom: 3px;
        left: 3px;
        right: 3px;`)}
    }
  }
`;

const MemberAssignment = ({ member, onClick, small }) => (
  member
    ? <AssignedMember onClick={onClick} member={member} small={small} />
    : <UnassignedMember onClick={onClick} alt="Unassigned" small={small}>{' '}</UnassignedMember>
);

MemberAssignment.propTypes = {
  onClick: PropTypes.func.isRequired,
  member: PropTypes.shape({
    userId: PropTypes.number,
    profileThumbnailPictureHash: PropTypes.string,
    initials: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  }),
};

MemberAssignment.defaultProps = {
  member: null,
};

export default MemberAssignment;
