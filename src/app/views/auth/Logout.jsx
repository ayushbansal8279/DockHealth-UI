import { isNil } from 'ramda';
import { PureComponent } from 'react';
import { hashHistory } from 'react-router';
import { error } from 'actions/notification-actions';
import { mobileAnalyticsClient } from 'api/analytics-api';
import * as userApi from 'api/user-api';

export default class Logout extends PureComponent {
  componentDidMount = () => {
    const durationOfTimeSpentOnApp = this.getDurationOfTimeSpentOnApp();

    return userApi
      .logout()
      .then(() => {
        mobileAnalyticsClient.recordEvent('AUTH_EVENTS', {
          LOGOUT_SUCCESS: 'YES',
        });
        mobileAnalyticsClient.recordEvent('DURATION_INAPP', {
          TIME_DURATION: durationOfTimeSpentOnApp,
        });
      })
      .catch(error_ => {
        error(error_ && error_.message ? error_.message : 'Could not logout.');
        mobileAnalyticsClient.recordEvent('AUTH_EVENTS', {
          LOGOUT_SUCCESS: 'NO',
        });
      });
  };

  getDurationOfTimeSpentOnApp = () => {
    try {
      if (isNil(sessionStorage.sessionStartTime)) {
        return null;
      }

      const sessionEndTime = new Date().getTime();
      const timeDifference = sessionEndTime - sessionStorage.sessionStartTime;
      const differenceDate = new Date(timeDifference);
      return `${differenceDate.getUTCHours()}:${differenceDate.getUTCMinutes()}:${differenceDate.getUTCSeconds()}`;
    } catch (error_) {
      return null;
    }
  };

  render() {
    return null;
  }
}
