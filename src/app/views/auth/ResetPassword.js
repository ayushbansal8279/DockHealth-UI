import React from 'react'
import { Link, browserHistory, hashHistory } from 'react-router'
import { SubmissionError } from 'redux-form'
import * as userApi from '../../api/user-api'
import { error, success } from '../../actions/notification-actions'
import ResetPasswordForm from '../../components/auth/ResetPasswordForm'

export default class ResetPassword extends React.Component {
  constructor (props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentWillMount() {
    let uname = this.props.location.query.uname;
    let code = this.props.location.query.code;
    console.log("uname: "+uname+" code:"+code);

    this.setState({username: uname, verificationCode: code});
  }

  onSubmit (form) {
    return userApi.resetPassword({
      username: form.username,
      verificationCode: form.verificationCode,
      password: form.password
    })
    .then(u => {
      success('Reset password. Please login')
      hashHistory.push('login')
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
    const formData = {username:this.state.username, verificationCode:this.state.verificationCode}

    return (
      <div className='section is-large form'>
        <div className='columns'>
          <div className='column is-medium'>
            <div className='notification'>
            </div>
          </div>
          <div className='column'>
            <div className="row log-in-form">
              <div className="medium-10 medium-centered large-10 large-centered columns">
                <h4 className="text-center">Reset Password</h4>
                <ResetPasswordForm type='Confirm' onSubmit={this.onSubmit} initialValues={formData}/>
                <p className="text-center"><Link to="/login">Login</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
