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
    case 'HIGH':
      return <PriorityDot color="#d0021b" />;
    case 'MEDIUM':
      return <PriorityDot color="#fb7c06" />;
    case 'LOW':
      return <PriorityDot color="#f6b039" />;
    default:
      return <PriorityDot color="#7f92a6" />;
  }
};

Priority.propTypes = {
  priority: PropTypes.oneOf(['HIGH', 'MEDIUM', 'LOW', null]),
};

Priority.defaultProps = {
  priority: null,
};

export default Priority;
