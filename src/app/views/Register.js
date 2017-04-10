import React from 'react'
import { Link, browserHistory } from 'react-router'
import { SubmissionError } from 'redux-form'
import * as userApi from '../api/user-api'
import { error, success } from '../reducers/notification'
import FormUser from '../components/auth/FormUser'

export default class Register extends React.Component {
  constructor (props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit (form) {
    return userApi.register({
      username: form.username,
      password: form.password,
      email: form.email
    })
    .then(u => {
      success('New user created. Please check your email.')
      browserHistory.push('/')
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
        <h2 className='title'>Register User</h2>
        <div className='columns'>
          <div className='column is-medium'>
            <div className='notification'>
              <p>Create an account here.</p><p>If you already have one, <Link to='/login'>Login</Link>. If you forgot your password, <Link to='/reset'>Reset it</Link>. If you have created an account, but need to have the verification link resent, just <Link to='/login'>Login</Link>.</p>
            </div>
          </div>
          <div className='column'>
            <FormUser type='Register' onSubmit={this.onSubmit} />
          </div>
        </div>
      </div>
    )
  }
}

Register.route = {
  path: 'register',
  component: Register
}
