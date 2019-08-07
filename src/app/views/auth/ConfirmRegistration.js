import React from 'react'
import { Link, browserHistory, hashHistory } from 'react-router'
import { SubmissionError } from 'redux-form'
import * as userApi from '../../api/user-api'
import { error, success } from '../../actions/notification-actions'
import ConfirmUserAccountForm from '../../components/auth/ConfirmUserAccountForm'
import {mobileAnalyticsClient} from '../../api/analytics-api'

export default class ConfirmRegistration extends React.Component {
  constructor (props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentWillMount() {
    let uname = this.props.location.query.uname;
    let code = this.props.location.query.code;
    console.log("uname: "+uname+" code:"+code);
    if(uname && code){
      return userApi.confirmRegistration({
        username: uname,
        confirmationCode: code
      })
      .then(u => {
        mobileAnalyticsClient.recordEvent('AUTH_EVENTS', {
            'CONFIRM_REGISTRATION_SUCCESS': 'YES'
        });
        success('Registration confirmed. Please Login')
        //alert('Registration confirmed. Please Login')
        // hashHistory.push('login')
        window.location.href = process.env.BRANCH_IO_APP_LINK;
        //hashHistory.push('confirmRegistrationSuccess')
      })
      .catch(e => {
        mobileAnalyticsClient.recordEvent('AUTH_EVENTS', {
            'CONFIRM_REGISTRATION_SUCCESS': 'NO'
        });
        let msg = e.message || 'An error occurred.'
        if(msg == "User cannot confirm because user status is not UNCONFIRMED."){
          window.location.href = process.env.BRANCH_IO_APP_LINK
          return
        }
        let field = false
        if (!field) {
          error(msg)
        }
      })
    }
  }

  onSubmit (form) {
    return userApi.confirmRegistration({
      username: form.username,
      confirmationCode: form.confirmationCode
    })
    .then(u => {
      success('Registration confirmed. Please Login')
      hashHistory.push('login')
    })
    .catch(e => {
      let msg = e.message || 'An error occurred.'
      if(msg == "User cannot confirm because user status is not UNCONFIRMED."){
        window.location.href = process.env.BRANCH_IO_APP_LINK
        return
      }
      let field = false
      if (!field) {
        error(msg)
      }
    })
  }

  render () {
    return (
      <div className="columns large-12">
          <div className="row expanded text-left">
            <div className="columns large-12 top-buffer">
              <h5>Confirm registration</h5>
            </div>
          </div>
          <ConfirmUserAccountForm type='Confirm' onSubmit={this.onSubmit} />
      </div>
    )
  }
}
