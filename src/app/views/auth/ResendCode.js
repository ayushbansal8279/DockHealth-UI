import React from 'react'
import { Link, browserHistory, hashHistory } from 'react-router'
import { SubmissionError } from 'redux-form'
import * as userApi from '../../api/user-api'
import { error, success } from '../../actions/notification-actions'
import ResendCodeForm from '../../components/auth/ResendCodeForm'
import {mobileAnalyticsClient} from '../../api/analytics-api'

export default class ResendCode extends React.Component {
  constructor (props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit (form) {
    return userApi.resendConfirmationCode({
      username: form.username
    })
    .then(u => {
      mobileAnalyticsClient.recordEvent('AUTH_EVENTS', {
          'RESEND_CODE_SUCCESS': 'YES'
      });
      success('Resent verification code. Please check your email.')
      hashHistory.push('confirmRegistration')
    })
    .catch(e => {
      mobileAnalyticsClient.recordEvent('AUTH_EVENTS', {
          'RESEND_CODE_SUCCESS': 'NO'
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
      <div className="wrapper columns large-12">
          <div className="row expanded text-center">
            <div className="columns large-12 top-buffer">
              <h5>Resend confirmation code</h5>
            </div>
          </div>
          <ResendCodeForm type='Confirm' onSubmit={this.onSubmit} />
      </div>
    )
  }
}
