import React from 'react'
import { Link, browserHistory, hashHistory } from 'react-router'
import { SubmissionError } from 'redux-form'
import * as userApi from '../../api/user-api'
import { error, success } from '../../actions/notification-actions'
import ForgotPasswordForm from '../../components/auth/ForgotPasswordForm'
import {mobileAnalyticsClient} from '../../api/analytics-api'

export default class ChangePassword extends React.Component {
  constructor (props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit (form) {
    return userApi.forgotPassword({
      username: form.username
    })
    .then(resp => {
      mobileAnalyticsClient.recordEvent('CHANGE_PASSWORD', {
          'SUCCESS': 'YES'
      });
      success('Sent verification code to: '+resp.CodeDeliveryDetails.Destination)
      hashHistory.push('resetPassword')
    })
    .catch(e => {
      mobileAnalyticsClient.recordEvent('CHANGE_PASSWORD', {
          'SUCCESS': 'NO'
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
              <h5>Change password</h5>
            </div>
          </div>
                <ForgotPasswordForm type='Confirm' onSubmit={this.onSubmit} />
      </div>
    )
  }
}
