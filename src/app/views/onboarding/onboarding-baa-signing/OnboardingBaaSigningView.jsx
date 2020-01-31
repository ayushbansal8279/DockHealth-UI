import Grid from '@material-ui/core/Grid';
import React, { useCallback, useRef } from 'react';
import useForm, { FormContext } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useMount } from 'react-use';
import { object, string } from 'yup';
import { hashHistory } from 'react-router';
import { setOnboardingCurrentStep } from '../../../actions/onboarding-progress-actions';
import {
  OnboardingButton,
  OnboardingH1Bold,
  OnboardingH2Bold,
  OnboardingInput,
  OnboardingSpacing1,
  OnboardingSpacing2,
  OnboardingSpacing4,
} from '../OnboardingTemplate.Components';
import { LegalEntityExamplesLabel } from './OnboardingBaaSigningView.Styled';
import { updateLegalEntityName } from '../../../api/organization-api';
import { showAlert } from '../../../helpers/utility-functions';

const REQUIRED_MESSAGE = 'This field is required';

const validationSchema = object().shape({
  legalEntityName: string().required(REQUIRED_MESSAGE),
  signatureId: string().required(REQUIRED_MESSAGE),
});

// eslint-disable-next-line unicorn/consistent-function-scoping
const onSubmit = ({ legalEntityName }) => {
  updateLegalEntityName({ legalEntityName })
    .then(() => {
      hashHistory.push('/onboarding/team-org-setup');
    })
    .catch(error => {
      showAlert({
        status: 'error',
        title: 'Error',
        text:
          error?.message ??
          'Error updating legal entity name, please try again later',
      });
    });
};

const OnboardingBaaSigningView = () => {
  const formMethods = useForm({
    validationSchema,
    revalidationMode: 'onChange',
  });

  const formReference = useRef(null);

  const dispatch = useDispatch();

  useMount(() => {
    setOnboardingCurrentStep({ currentStep: 3 })(dispatch);

    // eslint-disable-next-line no-unused-expressions
    window?.HelloSign.init('HELLOSIGN_ID');
  });

  const openHelloSign = useCallback(() => {
    // eslint-disable-next-line no-unused-expressions
    window?.HelloSign.open({
      url: 'SIGNING_URL',
      allowCancel: true,
      messageListener: eventData => {
        if (eventData.event === window?.HelloSign.EVENT_SIGNED) {
          formMethods.setValue('signatureId', eventData.signature_id);
          // eslint-disable-next-line no-unused-expressions
          formReference.current?.dispatchEvent(new Event('submit'));
        }
      },
    });
  }, [formMethods, formReference]);

  const hasLegalEntityName = Boolean(formMethods.watch('legalEntityName'));

  return (
    <form onSubmit={formMethods.handleSubmit(onSubmit)} ref={formReference}>
      <FormContext {...formMethods}>
        <input type="hidden" name="signatureId" />
        <OnboardingH1Bold>LAST BUT NOT LEAST,</OnboardingH1Bold>
        <OnboardingH1Bold>TELL US ABOUT YOURSELF...</OnboardingH1Bold>
        <OnboardingSpacing4 />
        <OnboardingH2Bold>Legal entity name</OnboardingH2Bold>
        <OnboardingSpacing2 />
        <OnboardingInput
          label="Legal Entity"
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
        <Grid container alignItems="flex-end" direction="column">
          <OnboardingButton
            type="button"
            variant="contained"
            onClick={openHelloSign}
            disabled={!hasLegalEntityName}
          >
            <OnboardingH2Bold>Read and sign BAA</OnboardingH2Bold>
          </OnboardingButton>
        </Grid>
      </FormContext>
    </form>
  );
};

export default OnboardingBaaSigningView;
