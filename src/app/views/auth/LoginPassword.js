import React from 'react';
import { hashHistory } from 'react-router';

import { error, success } from '../../actions/notification-actions';
import { mobileAnalyticsClient } from '../../api/analytics-api';
import * as userApi from '../../api/user-api';
import LoginFormPassword from '../../components/auth/LoginFormPassword';

const onSubmit = form => userApi
  .login(form.username, form.password)
  .then((data) => {
    mobileAnalyticsClient.recordEvent('AUTH_EVENTS', {
      LOGIN_SUCCESS: 'YES',
    });
    if (data === 'SMS_MFA') {
      hashHistory.push(`confirmMFACode?uname=${form.username}`);
    } else {
      sessionStorage.setItem('sessionStartTime', new Date().getTime());

      hashHistory.push('/');
      success('Logged in.');
    }
  })
  .catch((e) => {
    error(e && e.message ? e.message : 'Could not login.');
    mobileAnalyticsClient.recordEvent('AUTH_EVENTS', {
      LOGIN_SUCCESS: 'NO',
    });
  });

const LoginPassword = () => (
  <LoginFormPassword
    initialValues={{
      username: window.sessionStorage.getItem('username'),
    }}
    onSubmit={onSubmit}
  />
);

export default LoginPassword;
