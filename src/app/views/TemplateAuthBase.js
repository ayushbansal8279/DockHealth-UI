import { node } from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router';

import {
  BackgroundContainer,
  BackgroundModalContainer,
  ContentContainer,
  DockLogo,
  DockLogoContainer,
  MainContentContainer,
  SlantedBackgroundRectangleContainer,
  TemplateAuthBaseContainer,
} from './TemplateAuthBase.styled';

const TemplateAuthBase = ({ children }) => (
  <BackgroundContainer>
    <BackgroundModalContainer
      container
      style={{
        width: '100vw',
      }}
    >
      <TemplateAuthBaseContainer>
        <SlantedBackgroundRectangleContainer />
      </TemplateAuthBaseContainer>
      <ContentContainer>
        <DockLogoContainer>
          <a href="/">
            <DockLogo src="assets/img/dock-logo.png" alt="Dock Health" />
          </a>
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
