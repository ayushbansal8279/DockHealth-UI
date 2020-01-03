import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const EmptyHeaderContainer = styled.div`
  padding: 1rem;
  width: 100%;
`;

const EmptyHeader = ({ children }) => {
  return <EmptyHeaderContainer>{children}</EmptyHeaderContainer>;
};

EmptyHeader.propTypes = {
  children: PropTypes.node,
};

EmptyHeader.defaultProps = {
  children: '',
};

export default EmptyHeader;
