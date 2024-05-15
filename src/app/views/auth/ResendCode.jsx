import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';

import { error, success } from 'actions/notification-actions';
import * as UserAuthApi from 'api/user-auth-api';
import ResendCodeForm from 'components/auth/ResendCodeForm';

class ResendCode extends PureComponent {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(form) {
    const { history } = this.props;
    return UserAuthApi.resendConfirmationCode({
      username: form.username,
    })
      .then(() => {
        success('Resent verification code. Please check your email.');
        history.push('/auth/confirmRegistration');
      })
      .catch((error_) => {
        const message = error_.message || 'An error occurred.';
        const field = false;
        if (!field) {
          error(message);
        }
      });
  }

  render() {
    return <ResendCodeForm type="Confirm" onSubmit={this.onSubmit} />;
  }
}

export default withRouter(ResendCode);
