import React, { PureComponent } from 'react';
import { hashHistory } from 'react-router';

import { error, success } from '../../actions/notification-actions';
import { mobileAnalyticsClient } from '../../api/analytics-api';
import * as userApi from '../../api/user-api';
import ForgotPasswordForm from '../../components/auth/ForgotPasswordForm';

export default class ForgotPassword extends PureComponent {
  onSubmit = form =>
    userApi
      .forgotPassword({
        username: form.username,
      })
      .then(resp => {
        mobileAnalyticsClient.recordEvent('AUTH_EVENTS', {
          FORGOT_PASSWORD_SUCCESS: 'YES',
        });
        success(
          `Sent verification code to: ${resp.CodeDeliveryDetails.Destination}`,
        );
        window.sessionStorage.setItem('username', form.username)
        if(resp.CodeDeliveryDetails){
          const deliveryMedium = resp.CodeDeliveryDetails.DeliveryMedium
          if(deliveryMedium == "EMAIL"){
            hashHistory.push('resetPasswordEmailSent');
          }else{
            hashHistory.push('resetPassword');
          }
        }
      })
      .catch(e => {
        mobileAnalyticsClient.recordEvent('AUTH_EVENTS', {
          FORGOT_PASSWORD_SUCCESS: 'NO',
        });
        const msg = e.message || 'An error occurred.';

        error(msg);
      });

  render = () => <ForgotPasswordForm type="Confirm" onSubmit={this.onSubmit} />;
}
