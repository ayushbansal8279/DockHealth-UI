import React from 'react';
import styled from 'styled-components';

import CubesLoader from './CubesLoader';
import ScreenCenterContainer from './ScreenCenterContainer';

const AbsoluteScreenCenterContainer = styled(ScreenCenterContainer)`
  position: absolute;
`;

export default props => (
  <AbsoluteScreenCenterContainer {...props}>
    <CubesLoader />
  </AbsoluteScreenCenterContainer>
);
