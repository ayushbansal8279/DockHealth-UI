import React from 'react';
import styled from 'styled-components';

import CubesLoader from './CubesLoader';
import ScreenCenterContainer from './ScreenCenterContainer';

const AbsoluteScreenCenterContainer = styled(ScreenCenterContainer)`
  ${props => props.withBackground && '#ededf0'}
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
`;

export default props => (
  <AbsoluteScreenCenterContainer {...props}>
    <CubesLoader />
  </AbsoluteScreenCenterContainer>
);
