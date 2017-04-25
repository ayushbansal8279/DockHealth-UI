import React from 'react'
import { Link, browserHistory, hashHistory } from 'react-router'
import { SubmissionError } from 'redux-form'
import * as userApi from '../../api/user-api'
import { error, success } from '../../actions/notification-actions'
import ForgotPasswordForm from '../../components/auth/ForgotPasswordForm'

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
      success('Sent verification code to: '+resp.CodeDeliveryDetails.Destination)
      hashHistory.push('resetPassword')
    })
    .catch(e => {
      let msg = e.message || 'An error occurred.'
      let field = false
      if (!field) {
        error(msg)
      }
    })
  }

  render () {
    return (
      <div className='section is-large form'>
        {/*<h2 className='title'>Resend Code</h2>*/}
        <div className='columns'>
          <div className='column is-medium'>
            <div className='notification'>
              {/*<p><Link to='/login'>Login</Link>.</p>*/}
            </div>
          </div>
          <div className='column'>
            <div className="row log-in-form">
              <div className="medium-10 medium-centered large-10 large-centered columns">
                <h4 className="text-center">Forgot Password</h4>
                <ForgotPasswordForm type='Confirm' onSubmit={this.onSubmit} />
                <p className="text-center"><Link to="/resetPAssword">Reset Password</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
