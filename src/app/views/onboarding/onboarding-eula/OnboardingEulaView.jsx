import Grid from '@material-ui/core/Grid';
import React, { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hashHistory } from 'react-router';
import { useMount, useScroll, useToggle } from 'react-use';
import { setOnboardingCurrentStep } from '../../../actions/onboarding-progress-actions';
import { acknowledgeEula } from '../../../actions/user-actions';
import TaskCheckbox from '../../../components/task/TaskCheckbox';
import useBoolean from '../../../hooks/useBoolean';
import PdfIcon from '../../../img/pdf-icon.svg';
import {
  OnboardingAnchor,
  OnboardingButton,
  OnboardingH1Bold,
  OnboardingH2Bold,
  OnboardingH3,
  OnboardingHorizontalSpacing3,
  OnboardingHorizontalSpacing4,
  OnboardingSpacing1,
  OnboardingSpacing2,
  OnboardingSpacing4,
} from '../OnboardingTemplate.Components';
import EULA from './OnboardingEulaView.Eula';
import {
  EulaContainer,
  OnboardAcceptingGrid,
  OnboardAcceptingLabel,
} from './OnboardingEulaView.Styled';

const OnboardingEulaView = () => {
  const dispatch = useDispatch();
  const eulaContainerReference = useRef(null);
  const { y: scrollY } = useScroll(eulaContainerReference);
  const [isEulaRead, setEulaRead] = useBoolean(false);
  const [isEulaAccepted, toggleEulaAccepted] = useToggle(false);

  const scrollHeight = eulaContainerReference.current?.scrollHeight;
  const offsetHeight = eulaContainerReference.current?.offsetHeight;

  const { userProfile } = useSelector(store => {
    return {
      userProfile: store.userState.userProfile,
    };
  });

  useEffect(() => {
    if (!isEulaRead && scrollY > scrollHeight - offsetHeight) {
      setEulaRead();
    }
  }, [isEulaRead, offsetHeight, scrollHeight, scrollY, setEulaRead]);

  useMount(() => {
    setOnboardingCurrentStep({ currentStep: 2 })(dispatch);
  });

  const continueButtonDisabled = !isEulaRead || !isEulaAccepted;

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
        work and yours. We would love to setup you and your team to be HIPAA
        compliant which requires signing a few quick documents.
      </OnboardingH3>
      <OnboardingSpacing4 />
      <OnboardingH3>First, the End User License Agreement...</OnboardingH3>
      <OnboardingSpacing4 />
      <OnboardingH2Bold>
        What is an End User License Agreement (EULA)
      </OnboardingH2Bold>
      <OnboardingSpacing1 />
      <OnboardingH3>
        This document outlines the terms users must agree to in order to use the
        Dock Health platform. Please review carefully.
      </OnboardingH3>
      <OnboardingSpacing1 />
      <Grid container alignItems="center">
        <img alt="PDF icon" src={PdfIcon} />
        <OnboardingButton variant="outlinedLink">
          Open as a PDF
        </OnboardingButton>
      </Grid>
      <OnboardingSpacing2 />
      <EulaContainer ref={eulaContainerReference}>{EULA}</EulaContainer>
      <OnboardingSpacing4 />
      <OnboardAcceptingGrid
        container
        justify="space-between"
        alignItems="center"
        wrap="nowrap"
      >
        <Grid container direction="row" wrap="nowrap">
          <OnboardingHorizontalSpacing4 />
          <TaskCheckbox
            checked={isEulaAccepted}
            onChange={toggleEulaAccepted}
            disabled={!isEulaRead}
            color="#125375"
          />
          <OnboardingHorizontalSpacing3 />
          <OnboardingH3>
            <span>I agree to the End User License Agreement and </span>
            <OnboardingAnchor
              href="https://www.dock.health/privacypolicy"
              target="_blank"
            >
              Privacy Policy
            </OnboardingAnchor>
          </OnboardingH3>
        </Grid>
        <OnboardingButton
          disabled={continueButtonDisabled}
          variant="containedAutoWidth"
          onClick={onAgreeClick}
        >
          <OnboardingH2Bold>Agree & Continue</OnboardingH2Bold>
        </OnboardingButton>
      </OnboardAcceptingGrid>
      <OnboardAcceptingGrid container justify="flex-end" alignItems="center">
        <OnboardAcceptingLabel>
          You must scroll to the bottom of the agreement and click the checkbox
          in order to move forward.
        </OnboardAcceptingLabel>
      </OnboardAcceptingGrid>
    </div>
  );
};

export default OnboardingEulaView;
