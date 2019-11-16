import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

export const priorityColor = priority => {
  switch (priority) {
    // Inserted the No Status status
    default:
      return '#808080';
    case 'PLANNED':
      return '#f6b039';
    // Original color: #0ca1c7
    // Second color: #dc143c
    // This case used to be BLOCKED
    case 'ON_HOLD':
      return '#dc143c';
    // Original color: #f6b039
    case 'IN_PROGRESS':
      return '#00a73c';
  }
};

export const PriorityDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ color }) => color};
  flex-shrink: 0;
`;

PriorityDot.defaultProps = {
  color: '#00a73c',
};

const Priority = ({ priority, style }) => (
  <PriorityDot
    color={priorityColor(priority)}
    style={{
      margin: '0 auto',
      ...style,
    }}
  />
);

Priority.propTypes = {
  priority: PropTypes.oneOf(['PLANNED', 'ON_HOLD', 'IN_PROGRESS', null]),
};

Priority.defaultProps = {
  priority: null,
};

export const PriorityContainer = styled.div`
  align-items: flex-end;
  display: flex;
  height: 10px;
  justify-content: flex-start;
  width: 90px;
`;

export default Priority;
