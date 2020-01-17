import Grid from '@material-ui/core/Grid';
import React from 'react';
import useForm, { FormContext } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useMount } from 'react-use';
import { object, string } from 'yup';
import { hashHistory } from 'react-router';

import { setOnboardingCurrentStep } from '../../../actions/onboarding-progress-actions';
import PdfIcon from '../../../img/pdf-icon.svg';
import {
  OnboardingButton,
  OnboardingH2,
  OnboardingH2Bold,
  OnboardingH3,
  OnboardingInput,
  OnboardingSpacing1,
  OnboardingSpacing2,
  OnboardingSpacing4,
} from '../OnboardingTemplate.Components';
import BAA from './OnboardingBaaSigningView.Baa';
import {
  BaaContainer,
  LegalEntityExamplesLabel,
} from './OnboardingBaaSigningView.Styled';

const REQUIRED_MESSAGE = 'This field is required';

const validationSchema = object().shape({
  legalEntityName: string().required(REQUIRED_MESSAGE),
  organizationName: string().required(REQUIRED_MESSAGE),
  signature: string().required(REQUIRED_MESSAGE),
});

// eslint-disable-next-line unicorn/consistent-function-scoping
const onSubmit = () => () => {
  hashHistory.push('/onboarding/team-org-setup');
};

const OnboardingBaaSigningView = () => {
  const formMethods = useForm({
    validationSchema,
    revalidationMode: 'onChange',
  });
  const dispatch = useDispatch();

  useMount(() => {
    setOnboardingCurrentStep({ currentStep: 3 })(dispatch);
  });

  return (
    <form onSubmit={formMethods.handleSubmit(onSubmit())}>
      <FormContext {...formMethods}>
        <OnboardingH2>
          Last but not least, tell us about yourself...
        </OnboardingH2>
        <OnboardingSpacing4 />
        <OnboardingH2Bold>Legal entity name</OnboardingH2Bold>
        <OnboardingSpacing2 />
        <OnboardingInput
          label="Legal entity name"
          name="legalEntityName"
          placeholder="Enter signing legal entity name here"
          required
        />
        <OnboardingSpacing1 />
        <LegalEntityExamplesLabel>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed porta sem
          nec.
        </LegalEntityExamplesLabel>
        <OnboardingSpacing4 />
        <OnboardingH2Bold>Organization</OnboardingH2Bold>
        <OnboardingSpacing2 />
        <OnboardingInput
          label="What's the name of your organization?"
          name="organizationName"
          placeholder="Enter signing organization name here"
          required
        />
        <OnboardingSpacing1 />
        <OnboardingH3>
          You’re welcome to provide an organizational name that is different
          from your formal legal name. This is what you would call your group or
          practice.
        </OnboardingH3>
        <OnboardingSpacing4 />
        <OnboardingH2>
          This is a legal agreement between you and Dock Health
        </OnboardingH2>
        <Grid container alignItems="center">
          <img alt="PDF icon" src={PdfIcon} />
          <OnboardingButton variant="outlinedLink">
            Open as a PDF
          </OnboardingButton>
        </Grid>
        <OnboardingSpacing2 />
        <BaaContainer>{BAA}</BaaContainer>
        <OnboardingSpacing4 />
        <OnboardingInput
          label="Signature"
          name="signature"
          placeholder="Signature"
          required
        />
        <OnboardingSpacing4 />
        <Grid container justify="flex-end">
          <OnboardingButton type="submit" variant="containedAutoWidth">
            <OnboardingH2>Agree & continue</OnboardingH2>
          </OnboardingButton>
        </Grid>
      </FormContext>
    </form>
  );
};

export default OnboardingBaaSigningView;
