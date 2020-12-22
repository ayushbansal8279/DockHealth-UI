import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';

import { error, success } from 'actions/notification-actions';
import { mobileAnalyticsClient } from 'api/analytics-api';
import * as userApi from 'api/user-api';
import ResendCodeForm from 'components/auth/ResendCodeForm';

class ResendCode extends PureComponent {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(form) {
    const { history } = this.props;
    return userApi
      .resendConfirmationCode({
        username: form.username,
      })
      .then(() => {
        mobileAnalyticsClient.recordEvent('AUTH_EVENTS', {
          RESEND_CODE_SUCCESS: 'YES',
        });
        success('Resent verification code. Please check your email.');
        history.push('/auth/confirmRegistration');
      })
      .catch(error_ => {
        mobileAnalyticsClient.recordEvent('AUTH_EVENTS', {
          RESEND_CODE_SUCCESS: 'NO',
        });
        const message = error_.message || 'An error occurred.';
        const field = false;
        if (!field) {
          error(message);
        }
      });
  }

  render() {
    return (
      <div className="columns large-12">
        <div className="row expanded text-left">
          <div className="columns large-12 top-buffer">
            <h5>Resend confirmation code</h5>
          </div>
        </div>
        <ResendCodeForm type="Confirm" onSubmit={this.onSubmit} />
      </div>
    );
  }
}

export default withRouter(ResendCode);
