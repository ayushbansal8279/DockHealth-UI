import Grid from '@material-ui/core/Grid';
import React, { useCallback } from 'react';
import { hashHistory } from 'react-router';
import { useMount } from 'react-use';
import {
  signOrganizationBAADocument,
  storeSignatureResult,
} from '../../../api/organization-api';
import { showAlert } from '../../../helpers/utility-functions';
import useBoolean from '../../../hooks/useBoolean';
import {
  OnboardingButton,
  OnboardingH2Bold,
  OnboardingH3,
} from '../OnboardingTemplate.Components';
import InvitationForm from './OnboardingBaaOverviewView.InvitationForm';

const {
  HELLOSIGN_CLIENT_ID,
  HELLOSIGN_DOMAIN_VERIFICATION_ENABLED,
} = process.env;

const OnboardingBaaSigning = ({ mainDisplayOption }) => {
  const [
    isInvitationFormShown,
    showInvitationForm,
    hideInvitationForm,
  ] = useBoolean(false);

  useMount(() => {
    // eslint-disable-next-line no-unused-expressions
    window?.HelloSign.init(HELLOSIGN_CLIENT_ID);
  });

  const openHelloSign = useCallback(signingUrl => {
    let skipDomainVerification = true;
    if (
      HELLOSIGN_DOMAIN_VERIFICATION_ENABLED &&
      HELLOSIGN_DOMAIN_VERIFICATION_ENABLED === 'true'
    ) {
      skipDomainVerification = false;
    }

    // eslint-disable-next-line no-unused-expressions
    window?.HelloSign.open({
      url: signingUrl,
      allowCancel: true,
      skipDomainVerification,
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
      {!isInvitationFormShown && (
        <>
          {mainDisplayOption && (
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
                  <OnboardingH3>
                    Or share BAA with authorized signer
                  </OnboardingH3>
                </OnboardingButton>
              </Grid>
            </>
          )}
          {!mainDisplayOption && (
            <>
              <Grid container justify="flex-start">
                <OnboardingButton
                  onClick={showInvitationForm}
                  variant="outlinedSkip"
                  size="narrow"
                >
                  <OnboardingH3>
                    Send BAA to another authorized signer
                  </OnboardingH3>
                </OnboardingButton>
              </Grid>
              <Grid container justify="flex-start">
                <OnboardingButton
                  onClick={clickReadAndSign}
                  variant="outlinedSkip"
                >
                  <OnboardingH3>I can sign BAA</OnboardingH3>
                </OnboardingButton>
              </Grid>
            </>
          )}
        </>
      )}
      {isInvitationFormShown && (
        <InvitationForm hideInvitationForm={hideInvitationForm} />
      )}
    </div>
  );
};

export default OnboardingBaaSigning;
