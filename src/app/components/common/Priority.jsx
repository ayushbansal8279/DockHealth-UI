import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { getPriorityColor } from 'app/palette';

export const PriorityDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ color }) => color};
  flex-shrink: 0;
`;

const Priority = ({ priority, style }) => (
  <PriorityDot
    color={getPriorityColor(priority)}
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
  align-items: center;
  display: flex;
  height: 100%;
  ${props =>
    props.archivable
      ? 'margin-bottom: 0.375rem;'
      : 'padding-bottom: 0.1875rem;'}
  justify-content: center;
  width: 100%;
`;

export default Priority;
