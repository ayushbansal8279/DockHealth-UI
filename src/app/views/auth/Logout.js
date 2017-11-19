import React from 'react'
import { Link, browserHistory, hashHistory } from 'react-router'
import * as userApi from '../../api/user-api'
import { error, success } from '../../actions/notification-actions'
import {mobileAnalyticsClient} from '../../api/analytics-api'

export default class Logout extends React.Component {

   componentDidMount(){
    var durationOfTimeSpentOnApp = this.getDurationOfTimeSpentOnApp();
    return userApi.logout()
      .then(data => {
        mobileAnalyticsClient.recordEvent('AUTH_EVENTS', {
            'LOGOUT_SUCCESS': 'YES'
        });
        //console.log(data);
        mobileAnalyticsClient.recordEvent('DURATION_INAPP', {
            'TIME_DURATION': durationOfTimeSpentOnApp
        });
      })
      .catch(e => {
        error(e && e.message ? e.message : 'Could not logout.')
        mobileAnalyticsClient.recordEvent('AUTH_EVENTS', {
            'LOGOUT_SUCCESS': 'NO'
        });
      })
    }

    getDurationOfTimeSpentOnApp(){
      var readableDifference;
      try {
        if(sessionStorage.sessionStartTime == undefined || sessionStorage.sessionStartTime == null){
          return null;
        }

        var sessionEndTime= new Date().getTime();
        var timeDifference=sessionEndTime-sessionStorage.sessionStartTime;
        var differenceDate = new Date(timeDifference);
        readableDifference = differenceDate.getUTCHours() + ':' + differenceDate.getUTCMinutes() + ':' + differenceDate.getUTCSeconds();
        return readableDifference;
      }
      catch(e){
        console.log("Error in getDurationOfTimeSpentOnApp");
        return null;
      }
    }

  // onSubmit (form) {
  //   return userApi.login(form.username, form.password)
  //     .then(data => {
  //       if(data == "SMS_MFA"){
  //         hashHistory.push('confirmMFACode?uname='+form.username)
  //       }else{
  //         //browserHistory.push('/resetPassword')
  //         hashHistory.push('/')
  //         success('Logged in.')
  //       }
  //     })
  //     .catch(e => {
  //       error(e && e.message ? e.message : 'Could not login.')
  //     })
  // }

  render () {
    return (
			<div className="row expanded">
				<div className="columns large-12 text-center top-buffer">
					<h3>You have been logged out</h3>
				</div>
				<div className="columns large-12 top-buffer text-right details">
          <h4 className='subtitle'><Link to="/login">Login here</Link></h4>
				</div>

			</div>
    )
  }
}
