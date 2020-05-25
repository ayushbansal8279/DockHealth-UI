import React from 'react';
import { useSmallScreen } from 'helpers/utility-functions';
import DockHeaderLogo from 'img/dock-header-logo.svg';
import {
  OnboardingBackground,
  OnboardingLogo,
  OnboardingMainContainer,
  OnboardingNavbar,
} from './OnboardingTemplate.Components';

const OnboardingTemplate = ({ children }) => {
  const isSmallScreen = useSmallScreen();

  return (
    <OnboardingBackground>
      <OnboardingNavbar>
        <a href="/">
          <OnboardingLogo alt="Dock Health logo" src={DockHeaderLogo} />
        </a>
      </OnboardingNavbar>
      <OnboardingMainContainer isSmallScreen={isSmallScreen}>
        {children}
      </OnboardingMainContainer>
    </OnboardingBackground>
  );
};

export default OnboardingTemplate;
