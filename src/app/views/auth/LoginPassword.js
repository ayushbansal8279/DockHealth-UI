import React, { useCallback, useState } from 'react';
import { hashHistory } from 'react-router';

import { success } from '../../actions/notification-actions';
import { mobileAnalyticsClient } from '../../api/analytics-api';
import * as userApi from '../../api/user-api';
import LoginFormPassword from '../../components/auth/LoginFormPassword';

const LoginPassword = () => {
  const [customError, setCustomError] = useState('');

  const onSubmit = useCallback(form =>
    userApi
      .login(form.username, form.password)
      .then(data => {
        mobileAnalyticsClient.recordEvent('AUTH_EVENTS', {
          LOGIN_SUCCESS: 'YES',
        });
        if (data === 'SMS_MFA') {
          hashHistory.push('confirmMFACode?uname='+encodeURIComponent(form.username));
        } else {
          sessionStorage.setItem('sessionStartTime', new Date().getTime());

          hashHistory.push('/');
          success('Logged in.');
        }
      })
      .catch(e => {
        console.log(e && e.message ? e.message : 'Could not login.');
        setCustomError("Incorrect email or password. Please try again.");
        mobileAnalyticsClient.recordEvent('AUTH_EVENTS', {
          LOGIN_SUCCESS: 'NO',
        });
      }),
  );

  return (
    <LoginFormPassword
      initialValues={{
        username: window.sessionStorage.getItem('username'),
      }}
      onSubmit={onSubmit}
      customError={customError}
      setCustomError={setCustomError}
    />
  );
};

export default LoginPassword;
