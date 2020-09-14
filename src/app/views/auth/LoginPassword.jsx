/* eslint-disable sonarjs/cognitive-complexity */
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { hashHistory } from 'react-router';
import { useMount } from 'react-use';
import { setAuthBaseState } from 'actions/auth-base-actions';
import { success } from 'actions/notification-actions';
import { mobileAnalyticsClient } from 'api/analytics-api';
import { login, resendConfirmationCode } from 'api/user-api';
import LoginFormPassword from 'components/auth/LoginFormPassword';
import { showAlert, showToast } from 'helpers/utility-functions';
import { AUTH_BASE_STATES } from 'reducers/auth-base-reducer';

const LoginPassword = () => {
  const [unconfirmedUserFlag, setUnconfirmedUserFlag] = useState(false);

  const dispatch = useDispatch();

  const confirmStatus = sessionStorage.getItem('confirmStatus');

  const setConfirmationBaseState = useCallback(() => {
    setAuthBaseState({
      authBaseState: confirmStatus
        ? AUTH_BASE_STATES.DAILY_HUB
        : AUTH_BASE_STATES.DEFAULT,
    })(dispatch);
  }, [confirmStatus, dispatch]);

  useMount(() => {
    setConfirmationBaseState();
  });

  useEffect(() => {
    setConfirmationBaseState();
  }, [confirmStatus, setConfirmationBaseState]);

  const onSubmit = useCallback(
    ({ setError }) => form => {
      login(form.username, form.password)
        .then(data => {
          mobileAnalyticsClient.recordEvent('AUTH_EVENTS', {
            LOGIN_SUCCESS: 'YES',
          });
          if (data.challengeName === 'SMS_MFA') {
            if (data.challengeParam) {
              window.sessionStorage.setItem(
                'SMS_PHONE',
                data.challengeParam.CODE_DELIVERY_DESTINATION,
              );
            }
            hashHistory.push(
              `confirmMFACode?uname=${encodeURIComponent(form.username)}`,
            );
          } else {
            sessionStorage.setItem('sessionStartTime', new Date().getTime());
            const nextPathname = sessionStorage.getItem('next-page') || '/';
            if (nextPathname.includes('login')) {
              hashHistory.push('/home/my-tasks');
            } else {
              hashHistory.push(nextPathname);
            }

            sessionStorage.setItem('next-page', '');
            success('Logged in.');
          }
        })
        .catch(error => {
          let message = error?.message;
          const errorCode = error?.code;
          if (errorCode === 'UserNotConfirmedException') {
            message =
              'Email is not confirmed. Please check your email or click below to resend.'; // User is not confirmed.
            setUnconfirmedUserFlag(true);
          }

          setError(
            'password',
            'invalid',
            message ?? 'Incorrect email or password. Please try again.',

            // (error?.message!='User is not confirmed.') ?? 'Incorrect email or password. Please try again.',
          );
          mobileAnalyticsClient.recordEvent('AUTH_EVENTS', {
            LOGIN_SUCCESS: 'NO',
          });
        });
    },
    [],
  );

  const onResendCode = useCallback(
    // eslint-disable-next-line unicorn/consistent-function-scoping
    () => form => {
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
        .catch(error => {
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
    <LoginFormPassword
      initialValues={{
        username: window.sessionStorage.getItem('username'),
      }}
      onSubmit={onSubmit}
      onResendCode={onResendCode}
      onChange={onChange}
      unconfirmedUserFlag={unconfirmedUserFlag}
    />
  );
};

export default LoginPassword;
