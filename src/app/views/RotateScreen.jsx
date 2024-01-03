import React from 'react';
import styled from 'styled-components';
import DockHealthLogo from 'img/dock-health-logo.svg';
import spacing from 'styles/spacing';
import { typography } from 'styles/palette';

const RotateScreenContainer = styled.div`
  font-family: ${typography.text};
  display: flex;
  height: 100%;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 60px;

  & > img {
    margin-bottom: ${spacing.large};
  }
`;

const RotateScreen = () => (
  <RotateScreenContainer>
    <img src={DockHealthLogo} alt="logo" width="400" />
    <h1>Please rotate your screen</h1>
    <h2>
      We do not support portrait mode yet. Please go back to landscape mode for
      best experience.
    </h2>
  </RotateScreenContainer>
);

export default RotateScreen;
