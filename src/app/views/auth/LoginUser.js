import React from 'react'
import { Link, browserHistory, hashHistory } from 'react-router'
import * as userApi from '../../api/user-api'
import { error, success } from '../../actions/notification-actions'
import LoginFormPassword from '../../components/auth/LoginFormPassword'
import {mobileAnalyticsClient} from '../../api/analytics-api'


export default class LoginUser extends React.Component {
  onSubmit (form) {
    var username = window.sessionStorage.getItem("username")
    return userApi.login(username, form.password)
      .then(data => {
        mobileAnalyticsClient.recordEvent('AUTH_EVENTS', {
            'LOGIN_SUCCESS': 'YES'
        });
        if(data == "SMS_MFA"){
          hashHistory.push('confirmMFACode?uname='+form.username)
        }else{
          sessionStorage.setItem('sessionStartTime', new Date().getTime());

          hashHistory.push('/')
          success('Logged in.')
        }
      })
      .catch(e => {
        error(e && e.message ? e.message : 'Could not login.')
        mobileAnalyticsClient.recordEvent('AUTH_EVENTS', {
            'LOGIN_SUCCESS': 'NO'
        });
      })
  }

  render () {
    return (
        <LoginFormPassword onSubmit={this.onSubmit} />
    )
  }
}
