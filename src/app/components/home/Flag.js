import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

export const FlagLine = styled.div`
  width: 5px;
  height: 50px;
  margin: 0 auto;
  background: ${({ color }) => color};
`;

FlagLine.defaultProps = {
  color: 'transparent',
};

const Flag = ({ priority }) => {
  switch (priority) {
    case 'HIGH':
      return <FlagLine color="#fb7c06" />;
    default:
      return <FlagLine />;
  }
};

Flag.propTypes = {
  priority: PropTypes.oneOf(['HIGH', null]),
};

Flag.defaultProps = {
  priority: null,
};

export default Flag;
