import React from 'react';
import { number } from 'prop-types';
import { StyledAssignMemberIcon } from './styled';

const AssignMemberIcon = ({ size }) => {
  return <StyledAssignMemberIcon size={size} />;
};

AssignMemberIcon.propTypes = {
  size: number,
};

AssignMemberIcon.defaultProps = {
  size: 28,
};

export default AssignMemberIcon;
