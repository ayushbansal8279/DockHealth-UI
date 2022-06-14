import { Grid } from '@material-ui/core';
import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMount } from 'react-use';
import { useHistory } from 'react-router-dom';
import { checkBAASignedStatus } from 'actions/organization-actions';
import {
  signOrganizationBAADocument,
  storeSignatureResult,
  selectCurrentOrganization,
} from 'api/organization-api';
import Loader, { LoaderSizes } from 'components/common/Loader/Loader';
import Spacing from 'components/common/Spacing';
import Button from 'components/common/Button/Button';
import { showAlert, useSmallScreen } from 'helpers/utility-functions';
import { useBoolean } from 'hooks/useBoolean';
import { MontserratTypography } from 'styles/theme-montserrat';
import HelloSign from 'hellosign-embedded';
import { OnboardingAnchorDiv } from '../OnboardingTemplate.Components';
import InvitationForm from './OnboardingBaaOverviewView.InvitationForm';

const {
  HELLOSIGN_CLIENT_ID,
  HELLOSIGN_DOMAIN_VERIFICATION_ENABLED,
} = process.env;

const helloSignClient = new HelloSign();

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
            <Button
              onClick={clickReadAndSign}
              fullWidth={isSmallScreen}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <Loader size={LoaderSizes.medium} />
              ) : (
                <span>Continue</span>
              )}
            </Button>
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
  const history = useHistory();
  const [
    isInvitationFormShown,
    showInvitationForm,
    hideInvitationForm,
  ] = useBoolean(false);

  const [isProcessing, setProcessing] = useState(false);

  const currentUserProfile = useSelector(store => store.userState.userProfile);

  useMount(() => {
    // eslint-disable-next-line no-unused-expressions
  });

  const openHelloSign = useCallback(
    signingUrl => {
      const skipDomainVerification =
        HELLOSIGN_DOMAIN_VERIFICATION_ENABLED !== 'true';

      setProcessing(true);

      // eslint-disable-next-line no-unused-expressions
      helloSignClient.open(signingUrl, {
        clientId: HELLOSIGN_CLIENT_ID,
        allowCancel: true,
        skipDomainVerification,
      });

      helloSignClient.on('cancel', () => {
        setProcessing(false);
      });

      helloSignClient.on('error', (signatureId, errorCode) => {
        showAlert({
          status: 'error',
          title: 'Error',
          text: errorCode,
        });
        setProcessing(false);
      });

      helloSignClient.on('sign', signatureId => {
        storeSignatureResult({
          signatureIdentifier: signatureId.signatureId,
          signatureResult: 'signed',
        }).then(async () => {
          // eslint-disable-next-line no-unused-expressions
          helloSignClient.close();
          setProcessing(false);

          const { updatedByUser } = await checkBAASignedStatus()(dispatch);
          if (updatedByUser) {
            // window.location.href = '/#/onboarding/team-setup';
            window.location.href = '/#/core/home/my-tasks';
          } else {
            window.location.href = '/#/onboarding/organization-setup';
          }
          window.location.reload();
        });
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
      if (baaSignedOrganizations && baaSignedOrganizations.length > 0) {
        const { organizationIdentifier } = baaSignedOrganizations[0];
        sessionStorage.setItem(
          'currentOrganizationIdentifier',
          organizationIdentifier,
        );
        await selectCurrentOrganization(organizationIdentifier, false);
        history.push('/core/home/my-tasks');
      } else {
        sessionStorage.removeItem('next-page');
        history.push('/auth/login');
      }
    } else {
      sessionStorage.removeItem('next-page');
      history.push('/auth/login');
    }
  }, [currentUserProfile, history]);

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
