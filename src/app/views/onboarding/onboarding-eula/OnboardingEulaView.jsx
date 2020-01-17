import Grid from '@material-ui/core/Grid';
import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { hashHistory } from 'react-router';
import { useMount, useScroll, useToggle } from 'react-use';

import { setOnboardingCurrentStep } from '../../../actions/onboarding-progress-actions';
import TaskCheckbox from '../../../components/task/TaskCheckbox';
import useBoolean from '../../../hooks/useBoolean';
import PdfIcon from '../../../img/pdf-icon.svg';
import {
  OnboardingButton,
  OnboardingH1,
  OnboardingH2,
  OnboardingH2Bold,
  OnboardingH3,
  OnboardingHorizontalSpacing3,
  OnboardingSpacing1,
  OnboardingSpacing2,
  OnboardingSpacing3,
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

  useEffect(() => {
    if (!isEulaRead && scrollY > offsetHeight - scrollHeight) {
      setEulaRead();
    }
  }, [isEulaRead, offsetHeight, scrollHeight, scrollY, setEulaRead]);

  useMount(() => {
    setOnboardingCurrentStep({ currentStep: 2 })(dispatch);
  });

  const continueButtonDisabled = !isEulaRead || !isEulaAccepted;

  return (
    <div>
      <OnboardingH1>Welcome to Dock Health</OnboardingH1>
      <OnboardingH3>
        Protecting patient data and compliance with HIPAA is essential to our
        work and yours. We would love to setup you and your team to be HIPAA
        complaint which requires signing a few quick documents.
      </OnboardingH3>
      <OnboardingSpacing3 />
      <OnboardingH2>First, the End User License Agreement...</OnboardingH2>
      <OnboardingSpacing3 />
      <OnboardingH2Bold>
        What is a End User License Agreement (EULA)?
      </OnboardingH2Bold>
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
      <OnboardAcceptingGrid container justify="flex-end" alignItems="center">
        <TaskCheckbox
          checked={isEulaAccepted}
          onChange={toggleEulaAccepted}
          disabled={!isEulaRead}
        />
        <OnboardingHorizontalSpacing3 />
        <OnboardingH3>
          <span>I agree to the End User License Agreement and </span>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a>Privacy Policy</a>
        </OnboardingH3>
        <OnboardingHorizontalSpacing3 />
        <OnboardingButton
          disabled={continueButtonDisabled}
          variant="contained"
          onClick={() => {
            hashHistory.push('/onboarding/baa-overview');
          }}
        >
          Continue
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
