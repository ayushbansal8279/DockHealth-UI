import React, { PureComponent } from 'react';
import { hashHistory } from 'react-router';
import {
  error as errorNotification,
  success,
} from '../../actions/notification-actions';
import { mobileAnalyticsClient } from '../../api/analytics-api';
import * as userApi from '../../api/user-api';
import ConfirmMFACodeForm from '../../components/auth/ConfirmMfaCodeForm';

export default class ConfirmMFACode extends PureComponent {
  state = { username: '', customError: '' };

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillMount() {
    const { location } = this.props;
    this.state.username = location.query.uname;
  }

  setCustomError = customError => {
    this.setState({ customError });
  };

  onSubmit = form => {
    const { username } = this.state;

    return userApi
      .sendMFACode({
        username,
        mfaCode: form.mfaCode,
      })
      .then(() => {
        mobileAnalyticsClient.recordEvent('AUTH_EVENTS', {
          CONFIRM_MFACODE_SUCCESS: 'YES',
        });
        userApi.rememberDevice().then(result => {
          console.log(`added device to be remembered: ${result}`);
        });
        hashHistory.push('/');
        success('Logged in.');
      })
      .catch(error => {
        this.setState({
          customError: 'Invalid authentication code. Please try again.',
        });

        mobileAnalyticsClient.recordEvent('AUTH_EVENTS', {
          CONFIRM_MFACODE_SUCCESS: 'NO',
        });

        errorNotification(error.message || 'An error occurred.');
      });
  };

  render() {
    const { customError } = this.state;

    return (
      <ConfirmMFACodeForm
        type="Confirm"
        onSubmit={this.onSubmit}
        customError={customError}
        setCustomError={this.setCustomError}
      />
    );
  }
}
