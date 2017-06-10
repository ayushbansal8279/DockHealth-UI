import React from 'react'
import { Link, browserHistory, hashHistory } from 'react-router'
import { SubmissionError } from 'redux-form'
import * as userApi from '../../api/user-api'
import { error, success } from '../../actions/notification-actions'
import ConfirmMFACodeForm from '../../components/auth/ConfirmMFACodeForm'

export default class ConfirmMFACode extends React.Component {
  constructor (props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
    this.state = {username: ""}
  }

  componentWillMount() {
    let uname = this.props.location.query.uname
    this.state.username = uname
  }

  onSubmit (form) {
    return userApi.sendMFACode({
      username: this.state.username,
      mfaCode: form.mfaCode
    })
    .then(u => {
        userApi.rememberDevice ()
        .then(result => {
          console.log("added device to be remembered: "+result)
        })
        hashHistory.push('/')
        success('Logged in.')
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
    return (
        <ConfirmMFACodeForm type='Confirm' onSubmit={this.onSubmit} />
    )
  }
}
