import React from 'react';
import styled from 'styled-components';
import { Fade } from '@material-ui/core';

export const FadeContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 100px;
`;

export const StyledFade = styled(({ children, ...props }) => (
  <Fade {...props}>{children}</Fade>
))`
  transition-delay: 800ms;
`;

export default FadeContainer;
