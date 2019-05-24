import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

export const PriorityDot = styled.div`
  width: 10px;
  height: 10px;
  margin: 0 auto;
  border-radius: 50%;
  background: ${({ color }) => color};
`;

PriorityDot.defaultProps = {
  color: 'transparent',
};

const Priority = ({ priority }) => {
  switch (priority) {
    case 'BLOCKED':
      return <PriorityDot color="#d0021b" />;
    case 'ON_HOLD':
      return <PriorityDot color="#f6b039" />;
    default:
      return <PriorityDot />;
  }
};

Priority.propTypes = {
  priority: PropTypes.oneOf(['BLOCKED', 'ON_HOLD', 'IN_PROGRESS', null]),
};

Priority.defaultProps = {
  priority: null,
};

export default Priority;
