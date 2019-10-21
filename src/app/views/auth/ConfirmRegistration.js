import React, { PureComponent } from 'react';
import { hashHistory } from 'react-router';

import { error, success } from '../../actions/notification-actions';
import { mobileAnalyticsClient } from '../../api/analytics-api';
import * as userApi from '../../api/user-api';
import ConfirmUserAccountForm from '../../components/auth/ConfirmUserAccountForm';

export default class ConfirmRegistration extends PureComponent {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillMount() {
    const uname = this.props.location.query.uname;
    const code = this.props.location.query.code;
    console.log(`uname: ${uname} code:${code}`);
    if (uname && code) {
      return userApi
        .confirmRegistration({
          username: uname,
          confirmationCode: code,
        })
        .then(u => {
          mobileAnalyticsClient.recordEvent('AUTH_EVENTS', {
            CONFIRM_REGISTRATION_SUCCESS: 'YES',
          });
          success('Registration confirmed. Please Login');
          // alert('Registration confirmed. Please Login')
          // hashHistory.push('login')
          window.location.href = process.env.BRANCH_IO_APP_LINK;
          // hashHistory.push('confirmRegistrationSuccess')
        })
        .catch(e => {
          mobileAnalyticsClient.recordEvent('AUTH_EVENTS', {
            CONFIRM_REGISTRATION_SUCCESS: 'NO',
          });
          const msg = e.message || 'An error occurred.';
          if (
            msg == 'User cannot confirm because user status is not UNCONFIRMED.'
          ) {
            window.location.href = process.env.BRANCH_IO_APP_LINK;
            return;
          }
          const field = false;
          if (!field) {
            error(msg);
          }
        });
    }
  }

  onSubmit(form) {
    return userApi
      .confirmRegistration({
        username: form.username,
        confirmationCode: form.confirmationCode,
      })
      .then(u => {
        success('Registration confirmed. Please Login');
        hashHistory.push('login');
      })
      .catch(e => {
        const msg = e.message || 'An error occurred.';
        if (
          msg == 'User cannot confirm because user status is not UNCONFIRMED.'
        ) {
          window.location.href = process.env.BRANCH_IO_APP_LINK;
          return;
        }
        const field = false;
        if (!field) {
          error(msg);
        }
      });
  }

  render() {
    return (
      <div className="columns large-12">
        <div className="row expanded text-left">
          <div className="columns large-12 top-buffer">
            <h5>Confirm registration</h5>
          </div>
        </div>
        <ConfirmUserAccountForm type="Confirm" onSubmit={this.onSubmit} />
      </div>
    );
  }
}
