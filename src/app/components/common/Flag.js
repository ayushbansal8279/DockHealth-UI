import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

export const FlagLine = styled.div`
  width: 5px;
  flex-shrink: 0;
  background: ${({ color }) => color};
`;

FlagLine.defaultProps = {
  color: 'transparent',
};

const Flag = ({ priority }) => (
  <FlagLine color={priority === 'HIGH' && '#fb7c06'} />
);

Flag.propTypes = {
  priority: PropTypes.oneOf(['HIGH', null]),
};

Flag.defaultProps = {
  priority: null,
};

export default Flag;
