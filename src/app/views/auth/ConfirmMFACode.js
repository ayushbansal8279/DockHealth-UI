import React, { PureComponent } from 'react';
import { hashHistory } from 'react-router';

import { error, success } from '../../actions/notification-actions';
import { mobileAnalyticsClient } from '../../api/analytics-api';
import * as userApi from '../../api/user-api';
import ConfirmMFACodeForm from '../../components/auth/ConfirmMFACodeForm';

export default class ConfirmMFACode extends PureComponent {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = { username: '' };
  }
  
  componentWillMount() {
    const uname = this.props.location.query.uname;
    this.state.username = uname;
  }

  onSubmit = form =>
    userApi
      .sendMFACode({
        username: this.state.username,
        mfaCode: form.mfaCode,
      })
      .then(u => {
        mobileAnalyticsClient.recordEvent('AUTH_EVENTS', {
          CONFIRM_MFACODE_SUCCESS: 'YES',
        });
        userApi.rememberDevice().then(result => {
          console.log(`added device to be remembered: ${result}`);
        });
        hashHistory.push('/');
        success('Logged in.');
      })
      .catch(e => {
        mobileAnalyticsClient.recordEvent('AUTH_EVENTS', {
          CONFIRM_MFACODE_SUCCESS: 'NO',
        });
        const msg = e.message || 'An error occurred.';
        const field = false;
        if (!field) {
          error(msg);
        }
      });
  

  render() {
    return <ConfirmMFACodeForm type="Confirm" onSubmit={this.onSubmit} />;
  }
}
