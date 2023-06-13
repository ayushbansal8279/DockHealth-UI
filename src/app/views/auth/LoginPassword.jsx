/* eslint-disable sonarjs/cognitive-complexity */
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useMount } from 'react-use';
import { setAuthBaseState } from 'actions/auth-base-actions';
import { success } from 'actions/notification-actions';
import { login, resendConfirmationCode } from 'api/user-auth-api';
import LoginFormPassword from 'components/auth/LoginFormPassword';
import { showAlert, showToast } from 'helpers/utility-functions';
import { AUTH_BASE_STATES } from 'reducers/auth-base-reducer';
import DockHeaderLogo from 'img/dock-header-logo.svg';
import styled from 'styled-components';
import { Grid } from '@mui/material';
import Spacing from 'components/common/Spacing';
import { MontserratTypography } from 'styles/theme-montserrat';

const LoginPassword = () => {
  const [unconfirmedUserFlag, setUnconfirmedUserFlag] = useState(false);
  const history = useHistory();

  const dispatch = useDispatch();

  const confirmStatus = sessionStorage.getItem('confirmStatus');

  const DockLogoImage = styled.img.attrs({
    src: DockHeaderLogo,
    alt: 'Dock Health logo',
  })`
    align: center;
    width: 100%;
    object-fit: contain;
    height: 69px;
  `;

  const setConfirmationBaseState = useCallback(() => {
    setAuthBaseState({
      authBaseState: confirmStatus
        ? AUTH_BASE_STATES.DAILY_HUB
        : AUTH_BASE_STATES.LOGIN,
    })(dispatch);
  }, [confirmStatus, dispatch]);

  useMount(() => {
    setConfirmationBaseState();
  });

  useEffect(() => {
    setConfirmationBaseState();
  }, [confirmStatus, setConfirmationBaseState]);

  const onSubmit = useCallback(
    ({ setError }) =>
      (form) => {
        login(form.username, form.password)
          .then((data) => {
            if (data.challengeName === 'SMS_MFA') {
              if (data.challengeParam) {
                window.sessionStorage.setItem(
                  'SMS_PHONE',
                  data.challengeParam.CODE_DELIVERY_DESTINATION,
                );
              }
              history.push(
                `confirmMFACode?uname=${encodeURIComponent(form.username)}`,
              );
            } else {
              sessionStorage.setItem('sessionStartTime', Date.now());

              const nextPathname = sessionStorage.getItem('next-page');
              if (nextPathname && nextPathname !== '') {
                sessionStorage.setItem('next-page', '');
                history.push(nextPathname);
              } else {
                history.push('/core/home/my-tasks');
              }

              success('Logged in.');
            }
          })
          .catch((error) => {
            // let message = error?.message;
            let message = null;
            const errorCode = error?.code;
            if (errorCode === 'UserNotConfirmedException') {
              message =
                'Email is not confirmed. Please check your email or click below to resend.'; // User is not confirmed.
              setUnconfirmedUserFlag(true);
            }

            setError('password', {
              type: 'custom',
              message:
                message ?? 'Incorrect email or password. Please try again.',
            });
          });
      },
    [history],
  );

  const onResendCode = useCallback(
    // eslint-disable-next-line unicorn/consistent-function-scoping
    () => (form) => {
      resendConfirmationCode({
        username: form.username,
      })
        .then(() => {
          showToast({
            status: 'success',
            title: 'Account confirmation email resent',
          });
          setUnconfirmedUserFlag(false);
        })
        .catch((error) => {
          showAlert({
            icon: 'error',
            title: 'Error',
            text:
              error?.message ??
              'Could not resend email, please try again later',
          });
        });
    },
    [],
  );

  const onChange = () => {
    setUnconfirmedUserFlag(false);
  };

  return (
    <Grid container>
      <Grid item xs={12} alignItems="center" alignContent="center">
        <DockLogoImage />
        <Spacing vertical={5} />
      </Grid>
      <Grid item xs={12}>
        <LoginFormPassword
          initialValues={{
            username: window.sessionStorage.getItem('username'),
          }}
          onSubmit={onSubmit}
          onResendCode={onResendCode}
          onChange={onChange}
          unconfirmedUserFlag={unconfirmedUserFlag}
        />
      </Grid>
    </Grid>
  );
};

export default LoginPassword;
