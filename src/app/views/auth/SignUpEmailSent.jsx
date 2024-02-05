import { Grid, Typography } from '@mui/material';
import React, { useCallback } from 'react';
import Spacing from 'components/common/Spacing';
import DockHeaderLogo from 'img/dock-header-logo.svg';
import styled from 'styled-components';
import { resendConfirmationCode } from 'api/user-auth-api';
import { useMount } from 'react-use';
import { setAuthBaseState } from 'actions/auth-base-actions';
import { useDispatch } from 'react-redux';
import { AUTH_BASE_STATES } from 'reducers/auth-base-reducer';
import { OutfitTypography } from 'styles/theme-outfit';
import { useBoolean } from 'hooks/useBoolean';
import { redTheme } from 'modal/themes/red-theme';
import {
  ModalDescriptionContainer,
  ModalIconContainer,
  ModalMainIcon,
  ModalWrapper,
  FixedWidthButtonWrapper,
  ButtonsContainer,
} from 'modal/components/styled';
import { OnboardingDialog } from 'views/onboarding/OnboardingTemplate.Components';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import Button from 'components/common/v2/Button/Button';
import envelope from 'img/modals/envelope-red.svg';

const fontFamily = 'roboto condensed';

const onboardingMessageStyle = {
  fontFamily,
  fontWeight: 300,
  fontSize: '18px',
  padding: '0rem 1rem',
  display: 'block',
};

export default () => {
  const DockLogoImage = styled.img.attrs({
    src: DockHeaderLogo,
    alt: 'Dock Health logo',
  })`
    align: center;
    width: 100%;
    object-fit: contain;
    height: 69px;
  `;

  const dispatch = useDispatch();

  const [isDialogShown, showDialog, hideDialog] = useBoolean(false);

  useMount(() => {
    setAuthBaseState({
      authBaseState: AUTH_BASE_STATES.SIGN_UP,
    })(dispatch);
  });

  const username = window.sessionStorage.getItem('email');

  const handleResendEmail = useCallback(() => {
    showDialog();
    resendConfirmationCode({ username })
      .then((data) => {
        console.log(`sent confirmation code:`, data);
      })
      .catch((error) => {
        console.error(`error sending confirmation code:`, error);
      });
  }, [showDialog, username]);

  return (
    <Grid container style={{ height: '100%' }}>
      <Grid item xs={12}>
        <DockLogoImage />
        <Spacing vertical={6} />
      </Grid>
      <Grid item xs={12}>
        <OutfitTypography
          align="center"
          textDecoration={{
            fontSize: '32px',
            fontStyle: 'normal',
            fontWeight: '700',
            lineHeight: '60p',
          }}
        >
          Confirm your account via email.
        </OutfitTypography>
        <Spacing vertical={4} />
        <OutfitTypography
          align="center"
          weight="400"
          fontSize="16px"
          textDecoration={{
            color: 'rgba(0, 0, 0, 0.60)',
          }}
        >
          You received an email from support@dock.health <br /> Please verify
          your email address.
        </OutfitTypography>
        <Grid item xs={12}>
          <Spacing vertical={8} />
          <OutfitTypography
            weight="500"
            fontSize="16px"
            textDecoration={{
              color: 'rgba(0, 0, 0, 0.60)',
            }}
          >
            Haven’t received your email? Please check your spam.{' '}
            <strong style={{ cursor: 'pointer' }} onClick={handleResendEmail}>
              Resend email
            </strong>
          </OutfitTypography>
        </Grid>
      </Grid>
      <OnboardingDialog open={isDialogShown} fullWidth maxWidth="sm">
        <MuiThemeProvider theme={redTheme}>
          <ModalWrapper style={{ width: '500px' }}>
            <ModalIconContainer>
              <ModalMainIcon src={envelope} alt="envelope" />
              <Typography color="textPrimary" variant="h2" align="center">
                Confirmation Email Sent
              </Typography>
            </ModalIconContainer>
            <ModalDescriptionContainer>
              <OutfitTypography variant="h4">
                <span style={onboardingMessageStyle}>
                  {' '}
                  Confirmation Email has been sent to {username}{' '}
                </span>
              </OutfitTypography>
            </ModalDescriptionContainer>
            <ButtonsContainer>
              <FixedWidthButtonWrapper width={300}>
                <Button
                  fullWidth
                  variant="primary-red"
                  type="button"
                  onClick={() => {
                    hideDialog();
                  }}
                >
                  Close
                </Button>
              </FixedWidthButtonWrapper>
            </ButtonsContainer>
          </ModalWrapper>
        </MuiThemeProvider>
      </OnboardingDialog>
    </Grid>
  );
};
