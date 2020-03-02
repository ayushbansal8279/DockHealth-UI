import Hidden from '@material-ui/core/Hidden';
import { node } from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router';
import {
  BackgroundContainer,
  BackgroundModalContainer,
  BackgroundRectangleContainer,
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
      <Hidden smDown>
        <TemplateAuthBaseContainer>
          <SlantedBackgroundRectangleContainer />
        </TemplateAuthBaseContainer>
      </Hidden>
      <Hidden mdUp>
        <BackgroundRectangleContainer />
      </Hidden>
      <ContentContainer>
        <DockLogoContainer>
          <a href="/">
            <DockLogo src="assets/img/dock-logo.svg" alt="Dock Health" />
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
