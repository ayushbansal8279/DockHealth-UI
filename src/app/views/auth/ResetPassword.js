import React, { PureComponent } from 'react';
import { hashHistory } from 'react-router';

import { error, success } from '../../actions/notification-actions';
import { mobileAnalyticsClient } from '../../api/analytics-api';
import * as userApi from '../../api/user-api';
import ResetPasswordForm from '../../components/auth/ResetPasswordForm';

export default class ResetPassword extends PureComponent {
  onSubmit = form => {
    var {
      location: {
        query: { uname, code },
      },
    } = this.props;

    if(form.code){
      code = form.code
    }
    if(window.sessionStorage.getItem('username')){
      uname = window.sessionStorage.getItem('username')
    }

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
      .catch(e => {
        mobileAnalyticsClient.recordEvent('AUTH_EVENTS', {
          RESET_PASSWORD_SUCCESS: 'NO',
        });
        const msg = e.message || 'An error occurred.';

        error(msg);
      });
  };

  render = () => <ResetPasswordForm type="Confirm" onSubmit={this.onSubmit} />;
}
