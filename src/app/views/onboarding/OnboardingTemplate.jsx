import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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

import { checkUserAuthentication } from '../TemplateCore.Utilities';

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

const OnboardingTemplate = ({ children }) => {
  const { currentStep, progress } = useSelector(
    store => store.onboardingProgress,
  );

  const dispatch = useDispatch();

  useEffect(() => {
    checkUserAuthentication();
  }, [children, dispatch]);

  return (
    <OnboardingBackground>
      <OnboardingNavbar>
        <a href="/">
          <OnboardingLogo
            alt="Dock Health logo"
            src="assets/img/dock-logo.svg"
          />
        </a>
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
