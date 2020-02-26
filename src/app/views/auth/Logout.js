import Grid from '@material-ui/core/Grid';
import isNil from 'ramda/es/isNil';
import React, { PureComponent } from 'react';
import { hashHistory } from 'react-router';

import { error } from '../../actions/notification-actions';
import { mobileAnalyticsClient } from '../../api/analytics-api';
import * as userApi from '../../api/user-api';
import { TitleTypography } from '../../components/auth/AuthComponents.styled';

export default class Logout extends PureComponent {
  componentDidMount = () => {
    const durationOfTimeSpentOnApp = this.getDurationOfTimeSpentOnApp();

    return userApi
      .logout()
      .then(() => {
        mobileAnalyticsClient.recordEvent('AUTH_EVENTS', {
          LOGOUT_SUCCESS: 'YES',
        });
        // console.log(data);
        mobileAnalyticsClient.recordEvent('DURATION_INAPP', {
          TIME_DURATION: durationOfTimeSpentOnApp,
        });

        this.redirectToLogin();
      })
      .catch(error_ => {
        error(error_ && error_.message ? error_.message : 'Could not logout.');
        mobileAnalyticsClient.recordEvent('AUTH_EVENTS', {
          LOGOUT_SUCCESS: 'NO',
        });

        this.redirectToLogin();
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

  redirectToLogin = () => {
    // hashHistory.push('login');
    window.sessionStorage.removeItem('confirmStatus');
    window.location.href = '/';
  };

  render = () => (
    <Grid container>
      <TitleTypography variant="h2" style={{ marginTop: '6em' }}>
        You have been logged out
      </TitleTypography>
    </Grid>
  );
}
