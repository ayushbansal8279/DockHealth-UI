import React from 'react'
import { Link, browserHistory, hashHistory } from 'react-router'
import { SubmissionError } from 'redux-form'
import * as userApi from '../../api/user-api'
import { error, success } from '../../actions/notification-actions'
import UserRegistrationForm from '../../components/auth/UserRegistrationForm'

export default class Register extends React.Component {
  constructor (props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit (form) {
    return userApi.register({
      "username": form.username,
      "password": form.password,
      "email": form.username,
      "phone_number": "+1"+form.phoneNumber,
      "family_name": form.lastName,
      "given_name": form.firstName
      // "custom:title": form.title,
      // "custom:specialty": form.specialty,
      // "custom:subspecialty": form.subspecialty
    })
    .then(u => {
      success('New user created. Please check your email to confirm account registration.')
      alert("Please check your email to confirm the account registration");
      hashHistory.push('confirmRegistration')
    })
    .catch(e => {
      let msg = e.message || 'An error occurred.'
      let field = false
      if (msg.search('Password') !== -1) {
        field = true
        throw new SubmissionError({password: msg})
      }
      if (msg.search('User') !== -1) {
        field = true
        throw new SubmissionError({username: msg})
      }
      if (!field) {
        error(msg)
      }
    })
  }

  render () {
    return (
      <div className="wrapper columns align-self-middle large-6 large-offset-3">
        <div className="row expanded text-center">
          <div className="columns large-12">
            <img className="dock-logo" src="assets/img/dock-logo.png" alt="Dock Health"/>
          </div>
          <div className="columns large-12">
            <h5 className="top-buffer">Welcome! Create your account.</h5>
          </div>
        </div>
          <UserRegistrationForm type='Register' onSubmit={this.onSubmit} />
      </div>
    )
  }
}
