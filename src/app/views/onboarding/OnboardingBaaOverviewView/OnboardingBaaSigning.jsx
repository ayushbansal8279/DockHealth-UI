import { Grid } from '@material-ui/core';
import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMount } from 'react-use';
import { hashHistory } from 'react-router';
import { checkBAASignedStatus } from 'actions/organization-actions';
import {
  signOrganizationBAADocument,
  storeSignatureResult,
} from 'api/organization-api';
import Loader, { LoaderSizes } from 'components/common/Loader/Loader';
import Spacing from 'components/common/Spacing';
import Button from 'components/common/Button/Button';
import { showAlert, useSmallScreen } from 'helpers/utility-functions';
import useBoolean from 'hooks/useBoolean';
import { MontserratTypography } from 'styles/theme-montserrat';
import { selectCurrentOrganization } from 'api/user-api';
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
  onCancel,
}) =>
  mainDisplayOption
    ? {
        justify: isSmallScreen ? 'center' : 'flex-end',
        topElement: (
          <>
            <Button onClick={onCancel} type="button" variant="text">
              Cancel
            </Button>
            <OnboardingButton
              variant="contained"
              onClick={clickReadAndSign}
              fullWidth={isSmallScreen}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <Loader size={LoaderSizes.medium} />
              ) : (
                <span>Continue</span>
              )}
            </OnboardingButton>
          </>
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

// eslint-disable-next-line sonarjs/cognitive-complexity
const OnboardingBaaSigning = ({ mainDisplayOption }) => {
  const dispatch = useDispatch();
  const [
    isInvitationFormShown,
    showInvitationForm,
    hideInvitationForm,
  ] = useBoolean(false);

  const [isProcessing, setProcessing] = useState(false);

  const currentUserProfile = useSelector(store => store.userState.userProfile);

  useMount(() => {
    // eslint-disable-next-line no-unused-expressions
    window?.HelloSign.init(HELLOSIGN_CLIENT_ID);
  });

  const openHelloSign = useCallback(
    signingUrl => {
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
          }).then(async () => {
            // eslint-disable-next-line no-unused-expressions
            window?.HelloSign.close();
            setProcessing(false);

            if (eventData.event === window?.HelloSign.EVENT_SIGNED) {
              const { updatedByUser } = await checkBAASignedStatus()(dispatch);
              if (updatedByUser) {
                window.location.href = '/#/onboarding/team-setup';
              } else {
                window.location.href = '/#/onboarding/organization-setup';
              }
              window.location.reload();
            }
          });
        },
      });
    },
    [dispatch],
  );

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

  const onCancel = useCallback(async () => {
    const { userOrganizations } = currentUserProfile;
    if (userOrganizations && userOrganizations.length > 0) {
      const baaSignedOrganizations = userOrganizations?.filter(
        ({ baaSigned, subscriptionDetails }) =>
          baaSigned === true && subscriptionDetails?.trialEnded !== true,
      );
      const { organizationIdentifier } = baaSignedOrganizations[0];
      sessionStorage.setItem(
        'currentOrganizationIdentifier',
        organizationIdentifier,
      );
      await selectCurrentOrganization(organizationIdentifier, false);
      hashHistory.push('home');
    } else {
      sessionStorage.removeItem('next-page');
      hashHistory.push('login');
    }
  }, [currentUserProfile]);

  const isSmallScreen = useSmallScreen();

  const panelDetails = getPanelDetails({
    mainDisplayOption,
    isSmallScreen,
    clickReadAndSign,
    showInvitationForm,
    isProcessing,
    onCancel,
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
