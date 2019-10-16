import React, { PureComponent } from 'react';
import { hashHistory } from 'react-router';

import { error, success } from '../../actions/notification-actions';
import { mobileAnalyticsClient } from '../../api/analytics-api';
import * as userApi from '../../api/user-api';
import ResetPasswordForm from '../../components/auth/ResetPasswordForm';

export default class ResetPassword extends PureComponent {
  onSubmit = (form) => {
    const {
      location: {
        query: { uname, code },
      },
    } = this.props;

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
        hashHistory.push('login');
      })
      .catch((e) => {
        mobileAnalyticsClient.recordEvent('AUTH_EVENTS', {
          RESET_PASSWORD_SUCCESS: 'NO',
        });
        const msg = e.message || 'An error occurred.';
        const field = false;
        if (!field) {
          error(msg);
        }
      });
  };

  render = () => <ResetPasswordForm type="Confirm" onSubmit={this.onSubmit} />;
}
