import React from 'react'
import { Link, browserHistory, hashHistory } from 'react-router'
import * as userApi from '../../api/user-api'
import { error, success } from '../../actions/notification-actions'
import LoginForm from '../../components/auth/LoginForm'
import {mobileAnalyticsClient} from '../../api/analytics-api'

const performHealthCheck = function () {
    userApi.performHealthCheck()
    .then(data => {
          //console.log("Health Check OK")
     })
    .catch(e => {
        //console.log("Health Check NOT OK")
        if(sessionStorage.healthCheckIntervalId != null || sessionStorage.healthCheckIntervalId != undefined){
          clearInterval(sessionStorage.healthCheckIntervalId);
          sessionStorage.removeItem('healthCheckIntervalId');
        }
        userApi.logout()
        hashHistory.push('/pagenotfound')
     });
}

export default class Login extends React.Component {
  onSubmit (form) {
    return userApi.login(form.username, form.password)
      .then(data => {
        mobileAnalyticsClient.recordEvent('AUTH_EVENTS', {
            'LOGIN_SUCCESS': 'YES'
        });
        if(data == "SMS_MFA"){
          hashHistory.push('confirmMFACode?uname='+form.username)
        }else{
          sessionStorage.setItem('sessionStartTime', new Date().getTime());

          //clear any healthCheckIntervalId
          if(sessionStorage.healthCheckIntervalId != null || sessionStorage.healthCheckIntervalId != undefined){
            clearInterval(sessionStorage.healthCheckIntervalId);
            sessionStorage.removeItem('healthCheckIntervalId');
          }

          //performHealthCheck() //after AWS login, simply verify server health check, before starting health check timer
          var healthCheckInterval= parseInt(process.env.HEALTHCHECK_INTERVAL);
          var healthCheckIntervalId = setInterval(performHealthCheck,healthCheckInterval)
          sessionStorage.setItem('healthCheckIntervalId', healthCheckIntervalId);

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
        <LoginForm onSubmit={this.onSubmit} />
    )
  }
}
