import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { hashHistory } from 'react-router';
import { isAuthenticated } from '../../api/user-api';
import {
  OnboardingBackground,
  OnboardingLogo,
  OnboardingMainContainer,
  OnboardingNavbar,
  OnboardingProgressBar,
  OnboardingProgressDot,
  OnboardingProgressDotContainer,
  OnboardingProgressLabel,
  OnboardingProgressTrack,
  OnboardingProgressTrackActive,
} from './OnboardingTemplate.Components';
import ONBOARDING_STEPS from './OnboardingTemplate.OnboardingSteps';

const renderProgressDotContainer = ({ currentStep }) => ({ label, index }) => {
  const active = index < currentStep;
  const current = index === currentStep;

  return (
    <OnboardingProgressDotContainer key={index}>
      <OnboardingProgressDot active={active} current={current} />
      <OnboardingProgressLabel active={active || current}>
        {label}
      </OnboardingProgressLabel>
    </OnboardingProgressDotContainer>
  );
};

const CREATE_ACCOUNT_PATH = '/onboarding/create-account';
const EULA_PATH = '/onboarding/eula';

const isLoggedIn = loggedIn => {
  const { pathname } = hashHistory.getCurrentLocation();

  if (!loggedIn && pathname !== CREATE_ACCOUNT_PATH) {
    hashHistory.replace(CREATE_ACCOUNT_PATH);
  }

  if (loggedIn && pathname === CREATE_ACCOUNT_PATH) {
    hashHistory.replace(EULA_PATH);
  }
};

const OnboardingTemplate = ({ children }) => {
  const { currentStep, progress } = useSelector(
    store => store.onboardingProgress,
  );

  useEffect(() => {
    isAuthenticated({ isLoggedIn });
  }, [children]);

  return (
    <OnboardingBackground>
      <OnboardingNavbar>
        <OnboardingLogo alt="Dock Health logo" src="assets/img/dock-logo.png" />
        <OnboardingProgressBar>
          <OnboardingProgressTrack>
            <OnboardingProgressTrackActive width={progress} />
          </OnboardingProgressTrack>
          {ONBOARDING_STEPS.map(renderProgressDotContainer({ currentStep }))}
        </OnboardingProgressBar>
      </OnboardingNavbar>
      <OnboardingMainContainer>{children}</OnboardingMainContainer>
    </OnboardingBackground>
  );
};

export default OnboardingTemplate;
