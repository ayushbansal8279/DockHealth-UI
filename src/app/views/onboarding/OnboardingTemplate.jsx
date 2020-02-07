import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hashHistory } from 'react-router';
import * as userApi from '../../api/user-api';
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
const BAA_OVERVIEW_PATH = '/onboarding/baa-overview';
const TEAM_ORG_SETUP_PATH = '/onboarding/team-org-setup';

const isLoggedIn = (loggedIn, user) => {
  const { pathname } = hashHistory.getCurrentLocation();

  if (!user) {
    return;
  }

  if (!loggedIn && pathname !== CREATE_ACCOUNT_PATH) {
    hashHistory.replace(CREATE_ACCOUNT_PATH);
  }

  if (loggedIn && pathname === CREATE_ACCOUNT_PATH) {
    hashHistory.replace(EULA_PATH);
  }

  userApi.updateStoreWithCurrentUser(user);
  userApi.getUserByEmail(user.username, user).then(data => {
    if (loggedIn && pathname === TEAM_ORG_SETUP_PATH) {
      if (data.profileThumbnailPictureHash) {
        userApi.getUserProfilePic(data.userId, 'PROFILE');
      }
      userApi.getAllSpecialties();
      userApi.getAllTitles();
    }
    if (loggedIn && pathname === EULA_PATH && data.eulaAcknowledged) {
      hashHistory.replace(BAA_OVERVIEW_PATH);
    }
  });
};

const OnboardingTemplate = ({ children }) => {
  const { currentStep, progress } = useSelector(
    store => store.onboardingProgress,
  );

  const dispatch = useDispatch();

  useEffect(() => {
    userApi.isAuthenticated({
      isLoggedIn,
    });
  }, [children, dispatch]);

  return (
    <OnboardingBackground>
      <OnboardingNavbar>
        <a href="/">
          <OnboardingLogo
            alt="Dock Health logo"
            src="assets/img/dock-logo.png"
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
