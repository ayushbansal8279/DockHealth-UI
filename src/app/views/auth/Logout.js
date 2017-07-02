import React from 'react'
import { Link, browserHistory, hashHistory } from 'react-router'
import * as userApi from '../../api/user-api'
import { error, success } from '../../actions/notification-actions'

export default class Logout extends React.Component {

   componentDidMount(){
    return userApi.logout()
      .then(data => {
        console.log(data);
      })
      .catch(e => {
        error(e && e.message ? e.message : 'Could not lohgout.')
      })
    }

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
			<div className="row expanded">
				<div className="columns large-12 text-center top-buffer">
					<h3>You have been logged out</h3>
				</div>
				<div className="columns large-12 top-buffer text-right details">
          <Link to="/confirmRegistration">Login here</Link>
				</div>

			</div>
    )
  }
}



