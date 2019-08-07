import React from 'react'
import { Link, browserHistory, hashHistory } from 'react-router'
import * as userApi from '../../api/user-api'
import { error, success } from '../../actions/notification-actions'
import LoginFormUsername from '../../components/auth/LoginFormUsername'
import {mobileAnalyticsClient} from '../../api/analytics-api'

export default class Login extends React.Component {
  onSubmit (form) {
    var username = form.username
    window.sessionStorage.setItem('username', username)
    window.sessionStorage.removeItem("SSO_ACCESSTOKEN")
    window.sessionStorage.removeItem("SSO_REFRESHTOKEN")
    window.sessionStorage.removeItem("SSO_USEREMAIL")
    if(username!=null && (username.indexOf("@childrens.harvard.edu")!=-1
      || username.indexOf("@tch.harvard.edu")!=-1
      || username.indexOf("@chboston.org")!=-1
      || username.indexOf("@cardio.chboston.org")!=-1)){
      window.location.href = process.env.HEYDOC_SERVICES_BASE_URL+'oidc/authorize'
    }else{
      hashHistory.push('loginUser')
    }
  }

  render () {
    return (
        <LoginFormUsername onSubmit={this.onSubmit} />
    )
  }
}
