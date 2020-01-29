import Grid from '@material-ui/core/Grid';
import React, { useEffect, useRef } from 'react';
import useForm, { FormContext } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { hashHistory } from 'react-router';
import { useMount, useScroll } from 'react-use';
import { object, string } from 'yup';
import { setOnboardingCurrentStep } from '../../../actions/onboarding-progress-actions';
import useBoolean from '../../../hooks/useBoolean';
import PdfIcon from '../../../img/pdf-icon.svg';
import {
  OnboardingButton,
  OnboardingH1Bold,
  OnboardingH2,
  OnboardingH2Bold,
  OnboardingInput,
  OnboardingSpacing1,
  OnboardingSpacing2,
  OnboardingSpacing3,
  OnboardingSpacing4,
} from '../OnboardingTemplate.Components';
import BAA from './OnboardingBaaSigningView.Baa';
import {
  BaaAcceptingLabel,
  BaaContainer,
  LegalEntityExamplesLabel,
} from './OnboardingBaaSigningView.Styled';

const REQUIRED_MESSAGE = 'This field is required';

const validationSchema = object().shape({
  legalEntityName: string().required(REQUIRED_MESSAGE),
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

  const baaContainerReference = useRef(null);
  const { y: scrollY } = useScroll(baaContainerReference);
  const [isBaaRead, setBaaRead] = useBoolean(false);

  const scrollHeight = baaContainerReference.current?.scrollHeight;
  const offsetHeight = baaContainerReference.current?.offsetHeight;

  useEffect(() => {
    if (!isBaaRead && scrollY > scrollHeight - offsetHeight) {
      setBaaRead();
    }
  }, [isBaaRead, offsetHeight, scrollHeight, scrollY, setBaaRead]);

  return (
    <form onSubmit={formMethods.handleSubmit(onSubmit())}>
      <FormContext {...formMethods}>
        <OnboardingH1Bold>LAST BUT NOT LEAST,</OnboardingH1Bold>
        <OnboardingH1Bold>TELL US ABOUT YOURSELF...</OnboardingH1Bold>
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
        <BaaContainer ref={baaContainerReference}>{BAA}</BaaContainer>
        <OnboardingSpacing4 />
        <OnboardingInput
          label="Signature"
          name="signature"
          placeholder="Signature"
          required
        />
        <OnboardingSpacing4 />
        <Grid container alignItems="flex-end" direction="column">
          <OnboardingButton
            type="submit"
            variant="contained"
            disabled={!isBaaRead}
          >
            <OnboardingH2Bold>Agree & continue</OnboardingH2Bold>
          </OnboardingButton>
          <OnboardingSpacing3 />
          <BaaAcceptingLabel>
            You must scroll to the bottom of the agreement in order to move
            forward.
          </BaaAcceptingLabel>
        </Grid>
      </FormContext>
    </form>
  );
};

export default OnboardingBaaSigningView;
