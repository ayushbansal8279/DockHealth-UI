import React from 'react';
import styled from 'styled-components';

import Loader from './Loader';
import ScreenCenterContainer from '../ScreenCenterContainer';

const AbsoluteScreenCenterContainer = styled(ScreenCenterContainer)`
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
`;

export default props => (
  <AbsoluteScreenCenterContainer {...props}>
    <Loader />
  </AbsoluteScreenCenterContainer>
);
