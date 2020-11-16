import { isNil } from 'ramda';
import { PureComponent } from 'react';
import { hashHistory } from 'react-router';
import { connect } from 'react-redux';
import { error } from 'actions/notification-actions';
import { mobileAnalyticsClient } from 'api/analytics-api';
import * as userApi from 'api/user-api';
import { initializePusherForPresence } from 'helpers/pusher-instance';

class Logout extends PureComponent {
  componentDidMount = () => {
    const durationOfTimeSpentOnApp = this.getDurationOfTimeSpentOnApp();

    const { currentUser } = this.props;

    const pusherForPresence = initializePusherForPresence();
    const presenceChannelName = `presence-dock-users-${currentUser.organizationIdentifier}`;
    let presenceChannel = pusherForPresence?.channel(presenceChannelName);
    if (!presenceChannel || !presenceChannel.subscribed) {
      presenceChannel = pusherForPresence?.subscribe(presenceChannelName);
    }

    return userApi
      .logout()
      .then(() => {
        pusherForPresence?.unsubscribe(presenceChannelName);
        
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

const mapStateToProps = store => ({
  currentUser: store.userState.userProfile,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(Logout);
