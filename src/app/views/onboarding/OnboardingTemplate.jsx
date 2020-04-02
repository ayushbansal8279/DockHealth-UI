import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSmallScreen } from '../../helpers/utility-functions';
import DockHeaderLogo from '../../img/dock-header-logo.svg';
import { checkUserAuthentication } from '../TemplateCore.Utilities';
import {
  OnboardingBackground,
  OnboardingLogo,
  OnboardingMainContainer,
  OnboardingNavbar,
} from './OnboardingTemplate.Components';

const OnboardingTemplate = ({ children }) => {
  const isSmallScreen = useSmallScreen();

  const dispatch = useDispatch();

  useEffect(() => {
    checkUserAuthentication({ dispatch });
  }, [children, dispatch]);

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
