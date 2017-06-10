import React from 'react'
import { Link, browserHistory, hashHistory } from 'react-router'
import * as userApi from '../../api/user-api'
import { error, success } from '../../actions/notification-actions'
import LoginForm from '../../components/auth/LoginForm'

export default class Login extends React.Component {
  onSubmit (form) {
    return userApi.login(form.username, form.password)
      .then(data => {
        if(data == "SMS_MFA"){
          hashHistory.push('confirmMFACode?uname='+form.username)
        }else{
          //browserHistory.push('/resetPassword')
          hashHistory.push('/')
          success('Logged in.')
        }
      })
      .catch(e => {
        error(e && e.message ? e.message : 'Could not login.')
      })
  }

  render () {
    return (
        <LoginForm onSubmit={this.onSubmit} />
    )
  }
}



