import React, { PureComponent } from 'react';
import { hashHistory } from 'react-router';

import { error, success } from '../../actions/notification-actions';
import { mobileAnalyticsClient } from '../../api/analytics-api';
import * as userApi from '../../api/user-api';
import ResetPasswordForm from '../../components/auth/ResetPasswordForm';

export default class ResetPassword extends PureComponent {
  onSubmit = form => {
    let {
      location: {
        query: { uname, code },
      },
    } = this.props;

    code ||= form.code;
    uname ||= window.sessionStorage.getItem('username');

    return userApi
      .resetPassword({
        username: uname,
        verificationCode: code,
        password: form.password,
      })
      .then(() => {
        mobileAnalyticsClient.recordEvent('AUTH_EVENTS', {
          RESET_PASSWORD_SUCCESS: 'YES',
        });
        success('Reset password. Please login');
        hashHistory.push('resetPasswordSuccess');
      })
      .catch(error_ => {
        mobileAnalyticsClient.recordEvent('AUTH_EVENTS', {
          RESET_PASSWORD_SUCCESS: 'NO',
        });
        const message = error_.message || 'An error occurred.';

        error(message);
      });
  };

  render() {
    const {
      location: {
        query: { code, uname },
      },
    } = this.props;

    const authTokenReceived = Boolean(code && uname);

    return (
      <ResetPasswordForm
        type="Confirm"
        onSubmit={this.onSubmit}
        authTokenReceived={authTokenReceived}
      />
    );
  }
}
