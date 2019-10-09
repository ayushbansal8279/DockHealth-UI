import React from 'react';
import { hashHistory } from 'react-router';
import * as userApi from '../api/user-api';
import { mobileAnalyticsClient } from '../api/analytics-api';

class BaseComponent extends React.Component {
  componentDidMount() {
  }

  componentDidUpdate(prevProps, prevState) {
  }

  doTimeoutValidations() {
    const systemTimeout = parseInt(process.env.SYSTEM_TIMEOUT);

    if (sessionStorage.timeoutId != null || sessionStorage.timeoutId != undefined) {
      console.log(`${new Date()}: - clearTimeout${sessionStorage.timeoutId}`);
      clearTimeout(sessionStorage.timeoutId);
      sessionStorage.setItem('timeoutId', null);
    }

    const timeoutId = setTimeout(() => {
      // alert("You've timed out")
      userApi.logout()
        .then((data) => {
          mobileAnalyticsClient.recordEvent('AUTH_EVENTS', {
            TIMEOUT_SUCCESS: 'YES',
          });
        })
        .catch((e) => {
          console.log(e);
          mobileAnalyticsClient.recordEvent('AUTH_EVENTS', {
            TIMEOUT_SUCCESS: 'NO',
          });
        });

      clearTimeout(sessionStorage.timeoutId);
      sessionStorage.removeItem('timeoutId');
      const timeoutDate = new Date(systemTimeout);
      const durationOfTimeSpentOnApp = `${timeoutDate.getUTCHours()}:${timeoutDate.getUTCMinutes()}:${timeoutDate.getUTCSeconds()}`;
      mobileAnalyticsClient.recordEvent('DURATION_INAPP', {
        TIME_DURATION: durationOfTimeSpentOnApp,
      });
      hashHistory.push('/login');
    }, systemTimeout);

    sessionStorage.setItem('timeoutId', timeoutId);
  }
}
export default BaseComponent;
