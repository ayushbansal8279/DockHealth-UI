import React from 'react'
import { Link, browserHistory } from 'react-router'
import { SubmissionError } from 'redux-form'
//import { confirmRegistration } from '../api/user-api'
import * as userApi from '../api/user-api'
import { error, success } from '../reducers/notification'
import ConfirmUser from '../components/auth/ConfirmUser'

export default class ConfirmRegistration extends React.Component {
  constructor (props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit (form) {
    return userApi.confirmRegistration({
      username: form.username,
      confirmationCode: form.confirmationCode
    })
    .then(u => {
      success('Registration confirmed. Please Login')
      browserHistory.push('/')
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
        <h2 className='title'>Confirm Registration</h2>
        <div className='columns'>
          <div className='column is-medium'>
            <div className='notification'>
              <p>Can't find your code?, <Link to='/resendCode'>Resend</Link>.</p>
            </div>
          </div>
          <div className='column'>
            <ConfirmUser type='Confirm' onSubmit={this.onSubmit} />
          </div>
        </div>
      </div>
    )
  }
}

ConfirmRegistration.route = {
  path: 'confirmRegistration',
  component: ConfirmRegistration
}
