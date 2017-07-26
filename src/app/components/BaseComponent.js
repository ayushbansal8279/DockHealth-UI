import React from 'react'
import * as userApi from '../api/user-api'
import { Link, browserHistory, hashHistory } from 'react-router'
import {mobileAnalyticsClient} from '../api/analytics-api'

class BaseComponent extends React.Component {

    componentDidMount() {
        //console.log("BaseComponent didmount")
    }

  componentDidUpdate(prevProps, prevState) {
      enableFoundation();
      console.log("BaseComponent didupdate")
      this.doTimeoutValidations();
    }

  doTimeoutValidations(){
    var systemTimeout= parseInt(process.env.SYSTEM_TIMEOUT);

    if(sessionStorage.timeoutId != null || sessionStorage.timeoutId != undefined){
      //console.log("clearTimeout" + sessionStorage.timeoutId)
      clearTimeout(sessionStorage.timeoutId);
      sessionStorage.setItem('timeoutId', null);
    }

    var timeoutId = setTimeout(function () {
      //alert("You've timed out")
         userApi.logout()
         .then(data => {
           mobileAnalyticsClient.recordEvent('AUTH_EVENTS', {
               'TIMEOUT_SUCCESS': 'YES'
           });
        })
        .catch(e => {
          console.log(e)
          mobileAnalyticsClient.recordEvent('AUTH_EVENTS', {
              'TIMEOUT_SUCCESS': 'NO'
          });
        });

        clearTimeout(sessionStorage.timeoutId);
        sessionStorage.removeItem('timeoutId');
        var timeoutDate = new Date(systemTimeout);
        var durationOfTimeSpentOnApp = timeoutDate.getUTCHours() + ':' + timeoutDate.getUTCMinutes() + ':' + timeoutDate.getUTCSeconds();
        mobileAnalyticsClient.recordEvent('DURATION_INAPP', {
            'TIME_DURATION': durationOfTimeSpentOnApp
        });
        hashHistory.push('/login')

    }, systemTimeout)

    sessionStorage.setItem('timeoutId', timeoutId);
  }
}
export default BaseComponent
