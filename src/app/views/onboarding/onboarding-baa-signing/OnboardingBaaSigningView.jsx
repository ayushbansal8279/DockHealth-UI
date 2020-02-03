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
import {
  signOrganizationBAADocument,
  storeSignatureResult,
} from '../../../api/organization-api';
import { showAlert } from '../../../helpers/utility-functions';

const REQUIRED_MESSAGE = 'This field is required';
const { HELLOSIGN_CLIENT_ID } = process.env;

const validationSchema = object().shape({
  legalEntityName: string().required(REQUIRED_MESSAGE),
  signatureId: string().required(REQUIRED_MESSAGE),
});

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
    window?.HelloSign.init(HELLOSIGN_CLIENT_ID);
  });

  const openHelloSign = useCallback(
    signingUrl => {
      // eslint-disable-next-line no-unused-expressions
      window?.HelloSign.open({
        url: signingUrl,
        allowCancel: true,
        skipDomainVerification: true,
        messageListener: eventData => {
          // console.log(eventData);
          storeSignatureResult({
            signatureIdentifier: eventData.signature_id,
            signatureResult: eventData.event,
          });
          if (eventData.event === window?.HelloSign.EVENT_SIGNED) {
            // save
            // event: "signature_request_signed"
            formMethods.setValue('signatureId', eventData.signature_id);
            // eslint-disable-next-line no-unused-expressions
            // formReference.current?.dispatchEvent(new Event('submit'));
          }
          hashHistory.push('/onboarding/team-org-setup');
        },
      });
    },
    [formMethods],
  );

  const clickReadAndSign = useCallback(() => {
    // formReference.current?.dispatchEvent(new Event('submit'));
    const values = formMethods.getValues();
    // console.log(values);
    const errorMessage = 'Error getting BAA document to sign, please try later';
    const { legalEntityName } = values;
    signOrganizationBAADocument({ legalEntityName })
      .then(data => {
        // console.log(data);
        if (data.statusCode === 'SUCCESS') {
          openHelloSign(data.statusMessage);
        } else {
          showAlert({
            status: 'error',
            title: 'Error',
            text: errorMessage,
          });
        }
      })
      .catch(error => {
        showAlert({
          status: 'error',
          title: 'Error',
          text: error?.message ?? errorMessage,
        });
      });
  }, [formMethods, openHelloSign]);

  const hasLegalEntityName = Boolean(formMethods.watch('legalEntityName'));

  return (
    <form ref={formReference}>
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
            onClick={clickReadAndSign}
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
