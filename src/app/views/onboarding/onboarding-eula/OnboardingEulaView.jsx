import Grid from '@material-ui/core/Grid';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hashHistory } from 'react-router';
import { useMount, useToggle } from 'react-use';
import { setOnboardingCurrentStep } from '../../../actions/onboarding-progress-actions';
import { acknowledgeEula } from '../../../actions/user-actions';
import TaskCheckbox from '../../../components/task/TaskCheckbox';
import { useSmallScreen } from '../../../helpers/utility-functions';
import {
  OnboardingAnchor,
  OnboardingButton,
  OnboardingH1Bold,
  OnboardingH2,
  OnboardingH2Bold,
  OnboardingH3,
  OnboardingHorizontalSpacing3,
  OnboardingSmallScreenLogo,
  OnboardingSpacing2,
  OnboardingSpacing3,
  OnboardingSpacing4,
  OnboardingSpacing5,
  OnboardingSpacing6,
} from '../OnboardingTemplate.Components';

const OnboardingEulaView = () => {
  const dispatch = useDispatch();
  const [isEulaAccepted, toggleEulaAccepted] = useToggle(false);

  const { userProfile } = useSelector(store => {
    return {
      userProfile: store.userState.userProfile,
    };
  });

  useMount(() => {
    setOnboardingCurrentStep({ currentStep: 2 })(dispatch);
  });

  const continueButtonDisabled = !isEulaAccepted;

  const onAgreeClick = useCallback(() => {
    acknowledgeEula()(dispatch).then(() => {
      if (
        userProfile.orgUserRole === 'ADMIN' ||
        userProfile.orgUserRole === 'OWNER'
      ) {
        hashHistory.push('/onboarding/baa-overview');
      } else {
        hashHistory.push('/tasks');
      }
    });
  }, [dispatch, userProfile.orgUserRole]);

  const isSmallScreen = useSmallScreen();

  return (
    <div>
      {isSmallScreen && <OnboardingSmallScreenLogo />}
      <OnboardingH1Bold style={{ marginTop: isSmallScreen && '1em' }}>
        LET&apos;S GET STARTED
      </OnboardingH1Bold>
      <OnboardingSpacing3 />
      <OnboardingH2>
        Creating a great relationship with our customers, protecting patient
        data and compliance with HIPAA is essential to our work and yours.
      </OnboardingH2>
      <OnboardingSpacing2 />
      {!isSmallScreen && (
        <OnboardingH3>
          We would love to set up you and your team up to be HIPAA compliant
          which will require you reviewing and signing a few documents.
        </OnboardingH3>
      )}
      {isSmallScreen ? <OnboardingSpacing3 /> : <OnboardingSpacing5 />}
      <Grid container>
        <Grid item sm={12} container wrap="nowrap">
          <TaskCheckbox
            checked={isEulaAccepted}
            onChange={toggleEulaAccepted}
            color="#125375"
          />
          <OnboardingHorizontalSpacing3 />
          <OnboardingH3>
            <span>I have read and agree to the </span>
            <OnboardingAnchor
              href="https://www.dock.health/end-user-license-agreement"
              target="_blank"
            >
              End User License Agreement
            </OnboardingAnchor>
            <span> and </span>
            <OnboardingAnchor
              href="https://www.dock.health/privacypolicy"
              target="_blank"
            >
              Privacy Statement
            </OnboardingAnchor>
          </OnboardingH3>
        </Grid>
        {isSmallScreen ? <OnboardingSpacing4 /> : <OnboardingSpacing6 />}
        <Grid item sm={12} container justify="flex-end">
          <Grid item xs={12} sm={12} md={4}>
            <OnboardingButton
              disabled={continueButtonDisabled}
              variant="containedAutoWidth"
              onClick={onAgreeClick}
              fullWidth
            >
              <OnboardingH2Bold>Agree & Continue</OnboardingH2Bold>
            </OnboardingButton>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default OnboardingEulaView;
