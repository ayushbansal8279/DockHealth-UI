import React from 'react';
import { useSelector } from 'react-redux';

import ONBOARDING_STEPS from './OnboardingTemplate.OnboardingSteps';
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
