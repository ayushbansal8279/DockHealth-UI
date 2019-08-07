import React from 'react'
import { Link, browserHistory, hashHistory } from 'react-router'
import { SubmissionError } from 'redux-form'
import * as userApi from '../../api/user-api'
import { error, success } from '../../actions/notification-actions'
import ForgotPasswordForm from '../../components/auth/ForgotPasswordForm'
import {mobileAnalyticsClient} from '../../api/analytics-api'

export default class ForgotPassword extends React.Component {
  constructor (props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit (form) {
    return userApi.forgotPassword({
      username: form.username
    })
    .then(resp => {
      mobileAnalyticsClient.recordEvent('AUTH_EVENTS', {
          'FORGOT_PASSWORD_SUCCESS': 'YES'
      });
      success('Sent verification code to: '+resp.CodeDeliveryDetails.Destination)
      hashHistory.push('resetPassword')
    })
    .catch(e => {
      mobileAnalyticsClient.recordEvent('AUTH_EVENTS', {
          'FORGOT_PASSWORD_SUCCESS': 'NO'
      });
      let msg = e.message || 'An error occurred.'
      let field = false
      if (!field) {
        error(msg)
      }
    })
  }

  render () {
    return (
      <div className="columns large-12">
          <div className="row expanded text-left">
            <div className="columns large-12 top-buffer">
              <h5>Forgot password</h5>
            </div>
          </div>
          <ForgotPasswordForm type='Confirm' onSubmit={this.onSubmit} />
      </div>
    )
  }
}
