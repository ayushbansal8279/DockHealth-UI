import { Grid } from '@mui/material';
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

  useMount(() => {
    setAuthBaseState({
      authBaseState: AUTH_BASE_STATES.SIGN_UP,
    })(dispatch);
  });

  const username = window.sessionStorage.getItem('username');

  const handleResendEmail = useCallback(() => {
    resendConfirmationCode({ username })
      .then((data) => {
        console.log(`sent confirmation code:`, data);
      })
      .catch((error) => {
        console.error(`error sending confirmation code:`, error);
      });
  }, [username]);

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
            weight="700"
            fontSize="16px"
            textDecoration={{
              color: 'rgba(0, 0, 0, 0.60)',
            }}
          >
            Haven’t received your email? Please check your spam.{' '}
            <strong onClick={handleResendEmail}>Resend email</strong>
          </OutfitTypography>
        </Grid>
      </Grid>
    </Grid>
  );
};
