import React from 'react'
import { Link, browserHistory, hashHistory } from 'react-router'
import { SubmissionError } from 'redux-form'
import * as userApi from '../../api/user-api'
import { error, success } from '../../actions/notification-actions'
import FormUser from '../../components/auth/FormUser'

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
      <div className='section is-large form'>
        {/*<h2 className='title'>Register User</h2>*/}
        <div className='columns1'>
          <div className='column is-medium'>
            <div className='notification'>
              {/*<p>Create an account here.</p><p>If you already have one, <Link to='/login'>Login</Link>. If you forgot your password, <Link to='/reset'>Reset it</Link>. If you have created an account, but need to have the verification link resent, just <Link to='/login'>Login</Link>.</p>*/}
            </div>
          </div>
          <div className='column'>
            <div className="row log-in-form">
              <div className="medium-12 medium-centered large-12 large-centered columns1">
                <h4 className="text-center">Create Account</h4>
                <FormUser type='Register' onSubmit={this.onSubmit} />
                <p className="text-center"><Link to="/login">Login, if you already have an account</Link></p>   
                <p className="text-center"><Link to="/confirmRegistration">Confirm Registration</Link></p>
                <p className="text-center"><Link to="/resendCode">Resend verification link, if you have created an account</Link></p>   
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
