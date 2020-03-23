import { Grid } from '@material-ui/core';
import React, { useCallback } from 'react';
import { hashHistory } from 'react-router';
import { useMount } from 'react-use';
import {
  signOrganizationBAADocument,
  storeSignatureResult,
} from '../../../api/organization-api';
import { showAlert, useSmallScreen } from '../../../helpers/utility-functions';
import useBoolean from '../../../hooks/useBoolean';
import {
  OnboardingButton,
  OnboardingH2Bold,
  OnboardingH3,
  OnboardingSpacing2,
} from '../OnboardingTemplate.Components';
import InvitationForm from './OnboardingBaaOverviewView.InvitationForm';

const {
  HELLOSIGN_CLIENT_ID,
  HELLOSIGN_DOMAIN_VERIFICATION_ENABLED,
} = process.env;

const getPanelDetails = ({
  mainDisplayOption,
  isSmallScreen,
  clickReadAndSign,
  showInvitationForm,
}) =>
  mainDisplayOption
    ? {
        justify: isSmallScreen ? 'center' : 'flex-end',
        topButtonProps: {
          variant: 'contained',
          onClick: clickReadAndSign,
          fullWidth: isSmallScreen,
          children: <OnboardingH2Bold>Read and sign BAA</OnboardingH2Bold>,
        },
        bottomButtonProps: {
          variant: 'outlinedSkip',
          onClick: showInvitationForm,
          fullWidth: isSmallScreen,
          children: (
            <OnboardingH3>Or share BAA with authorized signer</OnboardingH3>
          ),
        },
      }
    : {
        justify: isSmallScreen ? 'center' : 'flex-start',
        topButtonProps: {
          variant: 'outlinedSkip',
          onClick: showInvitationForm,
          fullWidth: isSmallScreen,
          children: (
            <OnboardingH3>Send BAA to another authorized signer</OnboardingH3>
          ),
        },
        bottomButtonProps: {
          variant: 'outlinedSkip',
          onClick: clickReadAndSign,
          fullWidth: isSmallScreen,
          children: <OnboardingH3>I can sign BAA</OnboardingH3>,
        },
      };

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
    const skipDomainVerification =
      HELLOSIGN_DOMAIN_VERIFICATION_ENABLED !== 'true';

    // eslint-disable-next-line no-unused-expressions
    window?.HelloSign.open({
      url: signingUrl,
      allowCancel: true,
      skipDomainVerification,
      messageListener: eventData => {
        storeSignatureResult({
          signatureIdentifier: eventData.signature_id,
          signatureResult: eventData.event,
        }).then(() => {
          window?.HelloSign.close();
          if (eventData.event === window?.HelloSign.EVENT_SIGNED) {
            // hashHistory.replace('/onboarding/team-org-setup');
            window.location.href = '/#/onboarding/team-org-setup';
            window.location.reload();
          }
        });
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

  const isSmallScreen = useSmallScreen();

  const panelDetails = getPanelDetails({
    mainDisplayOption,
    isSmallScreen,
    clickReadAndSign,
    showInvitationForm,
  });

  return (
    <div>
      {!isInvitationFormShown && (
        <>
          <Grid container justify={panelDetails.justify}>
            <OnboardingButton type="button" {...panelDetails.topButtonProps} />
          </Grid>
          <OnboardingSpacing2 />
          <Grid container justify={panelDetails.justify}>
            <OnboardingButton
              type="button"
              {...panelDetails.bottomButtonProps}
            />
          </Grid>
        </>
      )}
      {isInvitationFormShown && (
        <InvitationForm hideInvitationForm={hideInvitationForm} />
      )}
    </div>
  );
};

export default OnboardingBaaSigning;
