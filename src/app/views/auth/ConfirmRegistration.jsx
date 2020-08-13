import React, { useState } from 'react';
import { hashHistory } from 'react-router';
import { useMount } from 'react-use';
import { success } from 'actions/notification-actions';
import { mobileAnalyticsClient } from 'api/analytics-api';
// import ConfirmUserAccountForm from 'components/auth/ConfirmUserAccountForm';
import { confirmRegistration, resendConfirmationCode } from 'api/user-api';
import { StyledAnchorDiv } from 'components/auth/AuthComponents.styled';
import Spacing from 'components/common/Spacing';
import { showAlert, showToast } from 'helpers/utility-functions';
import useBoolean from 'hooks/useBoolean';
import { MontserratTypography } from 'styles/theme-montserrat';
import ConfirmEmailHeaderCheck from 'img/checked-circle.svg';
import {
  OnboardingDialog,
  OnboardingHeader,
} from '../onboarding/OnboardingTemplate.Components';

const resendEmail = async email => {
  try {
    await resendConfirmationCode({
      username: email,
    });
    showToast({
      status: 'success',
      title: 'Account confirmation email resent',
    });
  } catch (error) {
    showAlert({
      status: 'error',
      title: 'Error',
      text: error?.message ?? 'Could not resend email, please try again later',
    });
  }
};

const ConfirmRegistration = props => {
  const [isDialogShown, showDialog] = useBoolean(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useMount(() => {
    const { uname } = props.location.query;
    const { code } = props.location.query;
    // console.log(`uname: ${uname} code:${code}`);
    if (uname && code) {
      setUserEmail(uname);
      return confirmRegistration({
        username: uname,
        confirmationCode: code,
      })
        .then(u => {
          mobileAnalyticsClient.recordEvent('AUTH_EVENTS', {
            CONFIRM_REGISTRATION_SUCCESS: 'YES',
          });

          success('Registration confirmed. Please Login');
          window.sessionStorage.setItem('confirmStatus', true);
          hashHistory.push(`login?uname=${encodeURIComponent(uname)}`);
          // window.location.href = process.env.BRANCH_IO_APP_LINK;
        })
        .catch(error => {
          mobileAnalyticsClient.recordEvent('AUTH_EVENTS', {
            CONFIRM_REGISTRATION_SUCCESS: 'NO',
          });
          const message = error.message || 'An error occurred.';
          if (
            message ===
            'User cannot confirm because user status is not UNCONFIRMED.'
          ) {
            hashHistory.push('login');
            // window.location.href = process.env.BRANCH_IO_APP_LINK;
            return;
          }
          setDialogTitle(`Email confirmation`);
          setDialogMessage(`You may have already confirmed your email.`);
          showDialog();
        });
    }
    hashHistory.push('login');
  });

  const onboardingDialogStyle = {
    fontFamily: 'roboto condensed',
    fontWeight: 300,
    fontSize: '18px',
    padding: '0rem 1rem',
  };

  const onboardingMessageStyle = {
    fontFamily: 'roboto condensed',
    fontWeight: 300,
    fontSize: '18px',
    padding: '0rem 1rem',
    display: 'block',
  };

  const onboardingLinkStyle = {
    fontFamily: 'roboto condensed',
    fontWeight: 300,
    fontSize: '18px',
  };

  return (
    <div className="columns large-12">
      <div className="row expanded text-left">
        <div className="columns large-12 top-buffer">
          <h5>Confirming your account ...</h5>
        </div>
      </div>
      {/* <ConfirmUserAccountForm type="Confirm" onSubmit={this.onSubmit} /> */}
      <OnboardingDialog open={isDialogShown} fullWidth maxWidth="sm">
        <OnboardingHeader>
          <MontserratTypography variant="h2">
            <span
              style={{
                fontWeight: 500,
                fontSize: '26px',
                paddingLeft: '1rem',
                lineHeight: '45px',
              }}
            >
              {' '}
              {dialogTitle}{' '}
            </span>
            <img
              src={ConfirmEmailHeaderCheck}
              style={{ float: 'right', height: '2.7rem' }}
              alt="Dock Health"
            />
          </MontserratTypography>
        </OnboardingHeader>
        <Spacing vertical={5} />
        <MontserratTypography variant="h4">
          <span style={onboardingMessageStyle}> {dialogMessage} </span>
        </MontserratTypography>
        <Spacing vertical={5} />
        <MontserratTypography variant="h4">
          <span style={onboardingDialogStyle}>Please try to</span>
          <StyledAnchorDiv
            style={onboardingLinkStyle}
            onClick={() => hashHistory.push('login')}
          >
            Sign In
          </StyledAnchorDiv>
        </MontserratTypography>
        <Spacing vertical={5} />
        <MontserratTypography variant="h4">
          <span style={onboardingDialogStyle}>
            I didn&apos;t get the confirmation email.{' '}
          </span>
          <StyledAnchorDiv
            style={onboardingLinkStyle}
            onClick={() => resendEmail(userEmail)}
          >
            Resend email
          </StyledAnchorDiv>
        </MontserratTypography>
        <Spacing vertical={5} />
      </OnboardingDialog>
    </div>
  );
};

export default ConfirmRegistration;
