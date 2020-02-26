import React, { useCallback } from 'react';
import { hashHistory } from 'react-router';
import { success } from '../../actions/notification-actions';
import { mobileAnalyticsClient } from '../../api/analytics-api';
import { login } from '../../api/user-api';
import LoginFormPassword from '../../components/auth/LoginFormPassword';

const LoginPassword = () => {
  const onSubmit = useCallback(
    ({ setError }) => form =>
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
          setError(
            'password',
            'invalid',
            error?.message ?? 'Incorrect email or password. Please try again.',
          );
          mobileAnalyticsClient.recordEvent('AUTH_EVENTS', {
            LOGIN_SUCCESS: 'NO',
          });
        }),
    [],
  );

  return (
    <LoginFormPassword
      initialValues={{
        username: window.sessionStorage.getItem('username'),
      }}
      onSubmit={onSubmit}
    />
  );
};

export default LoginPassword;
