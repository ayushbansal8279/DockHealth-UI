import { node } from 'prop-types';
import React, { Component } from 'react';
import { withRouter } from 'react-router';

import {
  BackgroundContainer,
  BackgroundModalContainer,
  BackgroundRectangleContainer,
  BigTemplateAuthBaseContainer,
  ContentContainer,
  DockLogo,
  DockLogoContainer,
  MainContentContainer,
  SmallBackgroundRectangleContainer,
  SmallTemplateAuthBaseContainer,
} from './TemplateAuthBase.styled';

const TemplateAuthBase = ({ children }) => (
  <BackgroundContainer>
    <BackgroundModalContainer
      container
      style={{
        width: '100vw',
      }}
    >
      <BigTemplateAuthBaseContainer>
        <BackgroundRectangleContainer>
          <img src="assets/img/svg/login-rectangle.svg" alt="Background" />
        </BackgroundRectangleContainer>
      </BigTemplateAuthBaseContainer>
      <SmallTemplateAuthBaseContainer>
        <SmallBackgroundRectangleContainer />
      </SmallTemplateAuthBaseContainer>
      <ContentContainer>
        <DockLogoContainer>
          <DockLogo src="assets/img/dock-logo.png" alt="Dock Health" />
        </DockLogoContainer>
        <MainContentContainer>{children}</MainContentContainer>
      </ContentContainer>
    </BackgroundModalContainer>
  </BackgroundContainer>
);
TemplateAuthBase.propTypes = {
  children: node.isRequired,
};

export default withRouter(TemplateAuthBase);
