import { Grid } from '@material-ui/core';
import React, { useCallback, useState } from 'react';
import { useMount } from 'react-use';
import {
  signOrganizationBAADocument,
  storeSignatureResult,
} from 'api/organization-api';
import Loader from 'components/common/Loader/Loader';
import Spacing from 'components/common/Spacing';
import { showAlert, useSmallScreen } from 'helpers/utility-functions';
import useBoolean from 'hooks/useBoolean';
import { MontserratTypography } from 'styles/theme-montserrat';
import {
  OnboardingAnchorDiv,
  OnboardingButton,
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
  isProcessing,
}) =>
  mainDisplayOption
    ? {
        justify: isSmallScreen ? 'center' : 'flex-end',
        topElement: (
          <OnboardingButton
            variant="contained"
            onClick={clickReadAndSign}
            fullWidth={isSmallScreen}
            disabled={isProcessing}
          >
            {isProcessing ? <Loader size={32} /> : <span>Continue</span>}
          </OnboardingButton>
        ),
        bottomElement: (
          <MontserratTypography variant="h4" noWrap>
            <span>Or </span>
            <OnboardingAnchorDiv onClick={showInvitationForm}>
              share BAA
            </OnboardingAnchorDiv>
            <span> with authorized signer</span>
          </MontserratTypography>
        ),
      }
    : {
        justify: isSmallScreen ? 'center' : 'flex-start',
        topElement: (
          <MontserratTypography variant="h4" noWrap>
            <OnboardingAnchorDiv onClick={showInvitationForm}>
              Send BAA
            </OnboardingAnchorDiv>
            <span> to another authorized signer</span>
          </MontserratTypography>
        ),
        bottomElement: (
          <MontserratTypography variant="h4" noWrap>
            <OnboardingAnchorDiv onClick={clickReadAndSign}>
              I can sign
            </OnboardingAnchorDiv>
            <span> BAA</span>
          </MontserratTypography>
        ),
      };

const OnboardingBaaSigning = ({ mainDisplayOption }) => {
  const [
    isInvitationFormShown,
    showInvitationForm,
    hideInvitationForm,
  ] = useBoolean(false);

  const [isProcessing, setProcessing] = useState(false);

  useMount(() => {
    // eslint-disable-next-line no-unused-expressions
    window?.HelloSign.init(HELLOSIGN_CLIENT_ID);
  });

  const openHelloSign = useCallback(signingUrl => {
    const skipDomainVerification =
      HELLOSIGN_DOMAIN_VERIFICATION_ENABLED !== 'true';

    setProcessing(true);

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
          // eslint-disable-next-line no-unused-expressions
          window?.HelloSign.close();
          setProcessing(false);
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
    isProcessing,
  });

  return (
    <div>
      {isInvitationFormShown ? (
        <InvitationForm hideInvitationForm={hideInvitationForm} />
      ) : (
        <>
          <Grid container justify={panelDetails.justify}>
            {panelDetails.topElement}
          </Grid>
          <Spacing vertical={4} />
          <Grid container justify={panelDetails.justify}>
            {panelDetails.bottomElement}
          </Grid>
        </>
      )}
    </div>
  );
};

export default OnboardingBaaSigning;
