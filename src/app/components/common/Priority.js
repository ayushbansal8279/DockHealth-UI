import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

export const priorityColor = priority => {
  switch (priority) {
    //Inserted the No Status status
    default: 
      return '#808080'
    case 'BLOCKED':
      return '#DC143C';
      //Original Color: #0ca1c7
    case 'ON_HOLD':
      return '#f6b039';
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
  priority: PropTypes.oneOf(['BLOCKED', 'ON_HOLD', 'IN_PROGRESS', null]),
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
