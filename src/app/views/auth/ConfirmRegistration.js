import React from 'react'
import { Link, browserHistory, hashHistory } from 'react-router'
import { SubmissionError } from 'redux-form'
//import { confirmRegistration } from '../api/user-api'
import * as userApi from '../../api/user-api'
import { error, success } from '../../actions/notification-actions'
import ConfirmUser from '../../components/auth/ConfirmUser'

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
        success('Registration confirmed. Please Login')
        alert('Registration confirmed. Please Login')
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
      let field = false
      if (!field) {
        error(msg)
      }
    })
  }

  render () {
    return (
      <div className='section is-large form'>
        {/*<h2 className='title'>Confirm Registration</h2>*/}
        <div className='columns'>
          <div className='column is-medium'>
            <div className='notification'>
              {/*<p>Can't find your code?, <Link to='/resendCode'>Resend</Link>.</p>*/}
            </div>
          </div>
          <div className='column'>
            <div className="row log-in-form">
              <div className="medium-10 medium-centered large-10 large-centered columns">
                <h4 className="text-center">Confirm Registration</h4>
                <ConfirmUser type='Confirm' onSubmit={this.onSubmit} />
                <p className="text-center"><Link to="/resendCode">Resend verification code</Link></p>
                <p className="text-center"><Link to="/login">Login, if you already have an account</Link></p>   
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
