import React, { PureComponent } from 'react';
import { hashHistory } from 'react-router';

import { error, success } from '../../actions/notification-actions';
import { mobileAnalyticsClient } from '../../api/analytics-api';
import * as userApi from '../../api/user-api';
import ForgotPasswordForm from '../../components/auth/ForgotPasswordForm';

export default class ChangePassword extends PureComponent {
  onSubmit = form =>
    userApi
      .forgotPassword({
        username: form.username,
      })
      .then(resp => {
        mobileAnalyticsClient.recordEvent('AUTH_EVENTS', {
          CHANGE_PASSWORD_SUCCESS: 'YES',
        });
        success(
          `Sent verification code to: ${resp.CodeDeliveryDetails.Destination}`,
        );
        hashHistory.push('resetPassword');
      })
      .catch(e => {
        mobileAnalyticsClient.recordEvent('AUTH_EVENTS', {
          CHANGE_PASSWORD_SUCCESS: 'NO',
        });
        const msg = e.message || 'An error occurred.';
        const field = false;
        if (!field) {
          error(msg);
        }
      });

  render() {
    return (
      <div className="columns large-12">
        <div className="row expanded text-left">
          <div className="columns large-12 top-buffer">
            <h5>Change password</h5>
          </div>
        </div>
        <ForgotPasswordForm type="Confirm" onSubmit={this.onSubmit} />
      </div>
    );
  }
}
