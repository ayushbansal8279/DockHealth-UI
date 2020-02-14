import Grid from '@material-ui/core/Grid';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { hashHistory } from 'react-router';
import { useMount } from 'react-use';
import { setOnboardingCurrentStep } from '../../../actions/onboarding-progress-actions';
import {
  signOrganizationBAADocument,
  storeSignatureResult,
} from '../../../api/organization-api';
import { showAlert } from '../../../helpers/utility-functions';
import useBoolean from '../../../hooks/useBoolean';
import {
  OnboardingButton,
  OnboardingH1Bold,
  OnboardingH2Bold,
  OnboardingH3,
  // OnboardingH3Bold,
  // OnboardingSpacing1,
  OnboardingSpacing3,
  OnboardingSpacing4,
  OnboardingSpacing5,
} from '../OnboardingTemplate.Components';
import InvitationForm from '../onboarding-baa-overview/OnboardingBaaOverviewView.InvitationForm';

const { HELLOSIGN_CLIENT_ID } = process.env;

const OnboardingBaaCheckView = () => {
  const dispatch = useDispatch();

  const [
    isInvitationFormShown,
    showInvitationForm,
    hideInvitationForm,
  ] = useBoolean(false);

  useMount(() => {
    setOnboardingCurrentStep({ currentStep: 3 })(dispatch);

    // eslint-disable-next-line no-unused-expressions
    window?.HelloSign.init(HELLOSIGN_CLIENT_ID);
  });

  const openHelloSign = useCallback(signingUrl => {
    // eslint-disable-next-line no-unused-expressions
    window?.HelloSign.open({
      url: signingUrl,
      allowCancel: true,
      skipDomainVerification: true,
      messageListener: eventData => {
        storeSignatureResult({
          signatureIdentifier: eventData.signature_id,
          signatureResult: eventData.event,
        });

        if (eventData.event === window?.HelloSign.EVENT_SIGNED) {
          hashHistory.push('/onboarding/team-org-setup');
        }
      },
    });
  }, []);

  const clickReadAndSign = useCallback(() => {
    const defaultErrorMessage =
      'Error getting BAA document to sign, please try later';

    signOrganizationBAADocument({ legalEntityName: null })
      .then(data => {
        if (data.statusCode === 'SUCCESS') {
          openHelloSign(data.statusMessage);
        } else {
          showAlert({
            status: 'error',
            title: 'Error',
            text: defaultErrorMessage,
          });
        }
      })
      .catch(error => {
        showAlert({
          status: 'error',
          title: 'Error',
          text: error?.message ?? defaultErrorMessage,
        });
      });
  }, [openHelloSign]);

  return (
    <div>
      <OnboardingH1Bold>BAA needed</OnboardingH1Bold>
      <OnboardingSpacing3 />
      <OnboardingH3>The Business Associate Agreement</OnboardingH3>
      <OnboardingSpacing4 />
      {/* <OnboardingH3Bold>
        What is a Business Associate Agreement (BAA)?
      </OnboardingH3Bold>
      <OnboardingSpacing1 />
      <OnboardingH3>
        A BAA is essential to HIPAA compliance and ensures that there is a
        legally binding contract between Dock Health and your organization to
        securely and safely manage Protected Health Information (PHI).
      </OnboardingH3>
      <OnboardingSpacing4 />
      <OnboardingH3>
        With this in place, it is safe to use the Dock Health platform for
        patient information provided you and your organization appropriately
        manage access to this data.
      </OnboardingH3>
      <OnboardingSpacing4 />
      <OnboardingH3Bold>Who should sign?</OnboardingH3Bold>
      <OnboardingSpacing1 />
      <OnboardingH3>
        To ensure HIPAA compliance, an officer of your organization with legal
        right to enter into a HIPAA Business Associate Agreement should be the
        one to sign. If you have someone without sufficient authority sign the
        agreement (an office administrator, for instance), then it&apos;s
        possible you&apos;re failing to properly meet your obligations under
        HIPAA.
      </OnboardingH3> */}
      <OnboardingSpacing5 />
      {!isInvitationFormShown && (
        <>
          <Grid container justify="flex-end">
            <OnboardingButton
              type="button"
              variant="contained"
              onClick={clickReadAndSign}
            >
              <OnboardingH2Bold>Read and sign BAA</OnboardingH2Bold>
            </OnboardingButton>
          </Grid>
          <Grid container justify="flex-end">
            <OnboardingButton
              onClick={showInvitationForm}
              variant="outlinedSkip"
              size="narrow"
            >
              <OnboardingH3>Or share BAA with authorized signer</OnboardingH3>
            </OnboardingButton>
          </Grid>
        </>
      )}
      {isInvitationFormShown && (
        <InvitationForm hideInvitationForm={hideInvitationForm} />
      )}
    </div>
  );
};

export default OnboardingBaaCheckView;
