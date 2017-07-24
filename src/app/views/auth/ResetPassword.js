import React from 'react'
import { Link, browserHistory, hashHistory } from 'react-router'
import { SubmissionError } from 'redux-form'
import * as userApi from '../../api/user-api'
import { error, success } from '../../actions/notification-actions'
import ResetPasswordForm from '../../components/auth/ResetPasswordForm'
import {mobileAnalyticsClient} from '../../api/analytics-api'

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
      mobileAnalyticsClient.recordEvent('RESET_PASSWORD', {
          'SUCCESS': 'YES'
      });
      success('Reset password. Please login')
      hashHistory.push('login')
    })
    .catch(e => {
      mobileAnalyticsClient.recordEvent('RESET_PASSWORD', {
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
    const formData = {username:this.state.username, verificationCode:this.state.verificationCode}

    return (
      <div className="wrapper columns large-12">
          <div className="row expanded text-center">
            <div className="columns large-12 top-buffer">
              <h5>Reset password</h5>
            </div>
          </div>
          <ResetPasswordForm type='Confirm' onSubmit={this.onSubmit} initialValues={formData}/>
      </div>
    )
  }
}
