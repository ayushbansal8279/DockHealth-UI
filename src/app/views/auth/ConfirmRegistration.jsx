import React, { useState } from 'react';
import queryString from 'query-string';
import { useHistory } from 'react-router-dom';
import { useMount } from 'react-use';
import { success } from 'actions/notification-actions';
import { useDispatch } from 'react-redux';
import { confirmRegistration, resendConfirmationCode } from 'api/user-auth-api';
import { StyledAnchorDiv } from 'components/auth/AuthComponents.styled';
import Spacing from 'components/common/Spacing';
import { showGlobalAlert, showGlobalErrorAlert } from 'alert/actions';
import { useBoolean } from 'hooks/useBoolean';
import { MontserratTypography } from 'styles/theme-montserrat';
import ConfirmEmailHeaderCheck from 'img/checked-circle.svg';
import redTheme from 'modal/themes/red-theme';
import {
  FixedWidthButtonWrapper,
  ModalDescriptionContainer,
  ModalIconContainer,
  ModalMainIcon,
  ModalWrapper,
} from 'modal/components/styled';
import { Button, Typography } from '@mui/material';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { ButtonsContainer } from 'views/dashboard/DashboardFirstVisitView/styled';
import { OnboardingDialog } from '../onboarding/OnboardingTemplate.Components';

const FONT_FAMILY_NAME = 'roboto condensed';

const resendEmail = async (email, dispatch) => {
  try {
    await resendConfirmationCode({
      username: email,
    });
    dispatch(showGlobalAlert('Account confirmation email resent'));
  } catch (error) {
    dispatch(
      showGlobalErrorAlert(
        error?.message ?? 'Could not resend email, please try again later',
      ),
    );
  }
};

const ConfirmRegistration = (props) => {
  const dispatch = useDispatch();
  const [isDialogShown, showDialog, hideDialog] = useBoolean(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const history = useHistory();

  useMount(() => {
    const { location } = props;
    const queryValues = queryString.parse(location.search);
    const { uname, code } = queryValues;

    if (uname && code) {
      setUserEmail(uname);
      return confirmRegistration({
        username: uname,
        confirmationCode: code,
      })
        .then(() => {
          success('Registration confirmed. Please Login');
          window.sessionStorage.setItem('confirmStatus', true);
          history.push(`login?uname=${encodeURIComponent(uname)}`);
          // window.location.href = import.meta.env.VITE_BRANCH_IO_APP_LINK;
        })
        .catch((error) => {
          const message = error.message || 'An error occurred.';
          if (
            message ===
            'User cannot confirm because user status is not UNCONFIRMED.'
          ) {
            history.push('login');
            // window.location.href = import.meta.env.VITE_BRANCH_IO_APP_LINK;
            return;
          }
          setDialogTitle(`Email confirmation`);
          setDialogMessage(`You may have already confirmed your email.`);
          showDialog();
        });
    }
    history.push('login');
  });

  const onboardingDialogStyle = {
    fontFamily: FONT_FAMILY_NAME,
    fontWeight: 300,
    fontSize: '18px',
    padding: '0rem 1rem',
  };

  const onboardingMessageStyle = {
    fontFamily: FONT_FAMILY_NAME,
    fontWeight: 300,
    fontSize: '18px',
    padding: '0rem 1rem',
    display: 'block',
  };

  const onboardingLinkStyle = {
    fontFamily: FONT_FAMILY_NAME,
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
      {/* <OnboardingDialog open={isDialogShown} fullWidth maxWidth="sm">
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
            onClick={() => history.push('login')}
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
            onClick={() => resendEmail(userEmail, dispatch)}
          >
            Resend email
          </StyledAnchorDiv>
        </MontserratTypography>
        <Spacing vertical={5} />
      </OnboardingDialog> */}
      <OnboardingDialog open={isDialogShown} fullWidth maxWidth="sm">
        <MuiThemeProvider theme={redTheme}>
          <ModalWrapper style={{ width: '500px' }}>
            <ModalIconContainer>
              <ModalMainIcon src={ConfirmEmailHeaderCheck} alt="envelope" />
              <Typography color="textPrimary" variant="h2" align="center">
                {dialogTitle}{' '}
              </Typography>
            </ModalIconContainer>
            <ModalDescriptionContainer>
              <MontserratTypography variant="h4">
                <span style={onboardingMessageStyle}> {dialogMessage} </span>
              </MontserratTypography>
              <Spacing vertical={5} />
              <MontserratTypography variant="h4">
                <span style={onboardingDialogStyle}>
                  I didn't get the confirmation email. .{' '}
                </span>
                <StyledAnchorDiv
                  style={onboardingLinkStyle}
                  onClick={() => resendEmail(userEmail, dispatch)}
                >
                  Resend email
                </StyledAnchorDiv>
              </MontserratTypography>

              <Spacing vertical={5} />

              <MontserratTypography variant="h4">
                <span style={onboardingDialogStyle}>
                  {' '}
                  Please try to Sign In{' '}
                </span>
                <StyledAnchorDiv
                  onClick={() => history.push('/auth/login')}
                  style={onboardingLinkStyle}
                >
                  Change email address
                </StyledAnchorDiv>
              </MontserratTypography>
              <Spacing vertical={2} />
            </ModalDescriptionContainer>
            <ButtonsContainer>
              <FixedWidthButtonWrapper width={300}>
                <Button
                  fullWidth
                  variant="primary-red"
                  type="button"
                  onClick={() => {
                    hideDialog();
                    history.push(`/auth/login`);
                  }}
                >
                  Login To My Account
                </Button>
              </FixedWidthButtonWrapper>
            </ButtonsContainer>
          </ModalWrapper>
        </MuiThemeProvider>
      </OnboardingDialog>
    </div>
  );
};

export default ConfirmRegistration;
