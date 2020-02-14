import Grid from '@material-ui/core/Grid';
import React, { useCallback } from 'react';
import parseHtml from 'react-html-parser';
import { useDispatch, useSelector } from 'react-redux';
import { hashHistory } from 'react-router';
import { useMount, useToggle } from 'react-use';
import { setOnboardingCurrentStep } from '../../../actions/onboarding-progress-actions';
import { acknowledgeEula } from '../../../actions/user-actions';
import TaskCheckbox from '../../../components/task/TaskCheckbox';
import {
  OnboardingAnchor,
  OnboardingButton,
  OnboardingH1Bold,
  OnboardingH2Bold,
  OnboardingH3,
  OnboardingHorizontalSpacing3,
  OnboardingSpacing2,
  OnboardingSpacing4,
} from '../OnboardingTemplate.Components';
import EULA from './OnboardingEulaView.Eula';
import {
  EulaContainer,
  OnboardAcceptingGrid,
} from './OnboardingEulaView.Styled';

const OnboardingEulaView = () => {
  const dispatch = useDispatch();
  const [isEulaAccepted, toggleEulaAccepted] = useToggle(false);
  const [
    isPrivacyStatementAccepted,
    togglePrivacyStatementAccepted,
  ] = useToggle(false);

  const { userProfile } = useSelector(store => {
    return {
      userProfile: store.userState.userProfile,
    };
  });

  useMount(() => {
    setOnboardingCurrentStep({ currentStep: 2 })(dispatch);
  });

  const continueButtonDisabled = !isPrivacyStatementAccepted || !isEulaAccepted;

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

  return (
    <div>
      <OnboardingH1Bold>JUST A FEW STEPS</OnboardingH1Bold>
      <OnboardingSpacing2 />
      <OnboardingH3>
        Protecting patient data and compliance with HIPAA is essential to our
        work and yours. We would love to set you and your team up to be HIPAA
        compliant which requires signing a few quick documents.
      </OnboardingH3>
      <OnboardingSpacing4 />
      <EulaContainer>{parseHtml(EULA)}</EulaContainer>
      <OnboardingSpacing4 />
      <OnboardAcceptingGrid container justify="flex-end">
        <Grid item sm={5} container wrap="nowrap">
          <TaskCheckbox
            checked={isEulaAccepted}
            onChange={toggleEulaAccepted}
            color="#125375"
          />
          <OnboardingHorizontalSpacing3 />
          <OnboardingH3>
            <span>I agree to the </span>
            <OnboardingAnchor
              href="https://www.dock.health/privacypolicy"
              target="_blank"
            >
              End User License Agreement
            </OnboardingAnchor>
          </OnboardingH3>
        </Grid>
      </OnboardAcceptingGrid>
      <OnboardAcceptingGrid container justify="flex-end">
        <Grid item sm={5} container wrap="nowrap">
          <TaskCheckbox
            checked={isPrivacyStatementAccepted}
            onChange={togglePrivacyStatementAccepted}
            color="#125375"
          />
          <OnboardingHorizontalSpacing3 />
          <OnboardingH3>
            <span>I agree to the </span>
            <OnboardingAnchor
              href="https://www.dock.health/end-user-license-agreement"
              target="_blank"
            >
              Privacy Statement
            </OnboardingAnchor>
          </OnboardingH3>
        </Grid>
      </OnboardAcceptingGrid>
      <OnboardAcceptingGrid container justify="flex-end">
        <Grid item sm={4}>
          <OnboardingButton
            disabled={continueButtonDisabled}
            variant="containedAutoWidth"
            onClick={onAgreeClick}
            fullWidth
          >
            <OnboardingH2Bold>Agree & Continue</OnboardingH2Bold>
          </OnboardingButton>
        </Grid>
      </OnboardAcceptingGrid>
    </div>
  );
};

export default OnboardingEulaView;
