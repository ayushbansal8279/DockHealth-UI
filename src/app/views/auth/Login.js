import React from 'react'
import { Link, browserHistory, hashHistory } from 'react-router'
import * as userApi from '../../api/user-api'
import { error, success } from '../../actions/notification-actions'
import FormLogin from '../../components/auth/FormLogin'

export default class Login extends React.Component {
  onSubmit (form) {
    return userApi.login(form.username, form.password)
      .then(data => {
        //browserHistory.push('/resetPassword')
        hashHistory.push('/')
        success('Logged in.')
      })
      .catch(e => {
        error(e && e.message ? e.message : 'Could not login.')
      })
  }

  render () {
    return (
      <div className='section form is-large'>
        {/*<h2 className='title'>Login</h2>*/}
        <div className='columns'>
          <div className='column is-medium'>
            <div className='notification'>
              {/*<p>Login to your account here.</p><p>If you don't have an account, <Link to='/register'>Register</Link>. If you forgot your password, go to <Link to='/reset'>Reset Password</Link>. If you have created an account, but need to have the verify, go to <Link to='/confirmRegistration'>Confirm Registration</Link>.</p>*/}
            </div>
          </div>
          <div className='column'>
            <div className="row log-in-form">
              <div className="medium-10 medium-centered large-10 large-centered columns">
                <h4 className="text-center">Login</h4>
                <FormLogin onSubmit={this.onSubmit} />
                <p className="text-center"><Link to="/forgotPassword">Forgot your password?</Link></p>
                <p className="text-center"><Link to="/register">Create Account</Link></p>
                <p className="text-center"><Link to="/confirmRegistration">Confirm Registration</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}



