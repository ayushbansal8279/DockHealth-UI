import React, { PureComponent } from 'react';
import { hashHistory } from 'react-router';

import { error, success } from '../../actions/notification-actions';
import { mobileAnalyticsClient } from '../../api/analytics-api';
import * as userApi from '../../api/user-api';
import ResetPasswordForm from '../../components/auth/ResetPasswordForm';

export default class ResetPassword extends PureComponent {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
  }

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

  render(){
    var authTokenReceived = false
    const uname = this.props.location.query.uname;
    const code = this.props.location.query.code;
    console.log(`uname: ${uname} code:${code}`);
    if (uname && code) {
      authTokenReceived = true
    }
    return (
      <ResetPasswordForm type="Confirm" onSubmit={this.onSubmit} authTokenReceived={authTokenReceived}/>
    )
  };
}
