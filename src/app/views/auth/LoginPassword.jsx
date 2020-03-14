import React, { useCallback, useState } from 'react';
import { hashHistory } from 'react-router';
import { success } from '../../actions/notification-actions';
import { mobileAnalyticsClient } from '../../api/analytics-api';
import { login, resendConfirmationCode } from '../../api/user-api';
import LoginFormPassword from '../../components/auth/LoginFormPassword';
import { showAlert, showToast } from '../../helpers/utility-functions';

const LoginPassword = () => {
  const [unconfirmedUserFlag, setUnconfirmedUserFlag] = useState(false);

  const onSubmit = useCallback(
    ({ setError }) => form => {
      login(form.username, form.password)
        .then(data => {
          mobileAnalyticsClient.recordEvent('AUTH_EVENTS', {
            LOGIN_SUCCESS: 'YES',
          });
          if (data === 'SMS_MFA') {
            hashHistory.push(
              `confirmMFACode?uname=${encodeURIComponent(form.username)}`,
            );
          } else {
            sessionStorage.setItem('sessionStartTime', new Date().getTime());
            const nextPathname = sessionStorage.getItem('next-page') || '/';
            hashHistory.push(nextPathname);
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
    () => form => {
      resendConfirmationCode({
        username: form.username,
      }).then(() => {
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
