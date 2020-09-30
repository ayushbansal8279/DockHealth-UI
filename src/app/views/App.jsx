import 'normalize.css/normalize.css';
import 'simplebar/dist/simplebar.min.css';

import { node } from 'prop-types';
import React, { PureComponent } from 'react';
import { isEmpty } from 'ramda';
import { connect } from 'react-redux';
import IdleTimer from 'react-idle-timer';
import { hashHistory } from 'react-router';
import styled from 'styled-components';
import ReactModal from 'react-modal';
import { initializePusherForPresence } from 'helpers/pusher-instance';

import { mobileAnalyticsClient } from 'api/analytics-api';
import * as userApi from 'api/user-api';
import Notification from 'components/common/Notification';
import ActivityAlertsToasts from 'components/common/ActivityAlerts/ActivityAlertsToasts';
import { featurePalette } from 'styles/palette';
import Modal from '../modal/Modal';
import RotateScreen from './RotateScreen';

const AppContainer = styled.div`
  font-family: 'Roboto', sans-serif;
  overflow-x: hidden;
  position: relative;
`;

const MainContainer = styled.main`
  height: 100vh;

  .fade-enter {
    opacity: 0;
    transform: translateY(10px);
  }
  .fade-enter-active {
    opacity: 1;
    transform: translateY(0px);
    transition: opacity 200ms, transform 200ms;
  }
  .fade-exit {
    opacity: 1;
    transform: translateY(0px);
  }
  .fade-exit-active {
    opacity: 0;
    transform: translateY(10px);
    transition: opacity 200ms, transform 200ms;
  }
  mark.list-highlight {
    color: inherit;
    background-color: ${featurePalette.globalSearchHighlight};
  }
`;

ReactModal.setAppElement('#app');

class App extends PureComponent {
  idleTimer = null;

  idleTimerForPresence = null;

  pusherForPresence = null;

  presenceChannelName = null;

  componentWillMount() {
    const redirectToHome = JSON.parse(sessionStorage.getItem('redirectToHome'));
    const redirectToLink = sessionStorage.getItem('redirectToLink');

    if (redirectToHome && !redirectToLink) {
      sessionStorage.removeItem('redirectToHome');
      if (window.location.hash !== '#/home/my-tasks') {
        window.location.href = '#/home/my-tasks';
      }
    }

    if (redirectToLink && !redirectToHome) {
      sessionStorage.removeItem('redirectToLink');
      window.location.href = redirectToLink;
    }
  }

  componentDidUpdate(previousProps) {
    const { userState: previousUserState } = previousProps;
    const {
      userState,
      setActiveUsers,
      addActiveUser,
      addIdleUser,
      removeUser,
    } = this.props;

    const { userProfile: previousUserProfile } = previousUserState;
    const { userProfile } = userState;

    const pusherForPresence = initializePusherForPresence();
    this.pusherForPresence = pusherForPresence;
    const presenceChannelName = `presence-dock-users`;
    this.presenceChannelName = presenceChannelName;
    if (isEmpty(previousUserProfile) && !isEmpty(userProfile)) {
      let presenceChannel = pusherForPresence.channel(presenceChannelName);
      if (!presenceChannel || !presenceChannel.subscribed) {
        presenceChannel = pusherForPresence.subscribe(presenceChannelName);

        presenceChannel.bind('pusher:subscription_succeeded', function({
          members,
        }) {
          const formattedMembers = Object.keys(members)?.map(memberKey => ({
            ...members[memberKey],
            userIdentifier: memberKey,
          }));

          setActiveUsers(formattedMembers);
        });

        presenceChannel.bind('pusher:member_added', function(member) {
          addActiveUser({
            ...member,
            userIdentifier: member.id,
          });
        });

        presenceChannel.bind('pusher:member_removed', function(member) {
          removeUser({
            ...member,
            userIdentifier: member.id,
          });
        });

        presenceChannel.bind('client-event-dock-user-idle', function(
          data,
          metadata,
        ) {
          // console.log('idle user:', presenceChannel.members.get(metadata.user_id).info);
          if (data.idle) {
            addIdleUser({
              userIdentifier: metadata.user_id,
            });
          } else {
            addActiveUser({
              userIdentifier: metadata.user_id,
            });
          }
        });
      }
    }
  }

  onAction = () => {};

  onActive = () => {};

  onIdle = () => {
    userApi
      .logout()
      .then(() => {
        mobileAnalyticsClient.recordEvent('AUTH_EVENTS', {
          TIMEOUT_SUCCESS: 'YES',
        });
      })
      .catch(() => {
        mobileAnalyticsClient.recordEvent('AUTH_EVENTS', {
          TIMEOUT_SUCCESS: 'NO',
        });
      });

    hashHistory.push('/login');
  };

  onActiveForPresence = () => {
    const presenceChannel = this.pusherForPresence.channel(
      this.presenceChannelName,
    );
    if (presenceChannel && presenceChannel.subscribed) {
      presenceChannel.trigger('client-event-dock-user-idle', { idle: false });
    }
  };

  onIdleForPresence = () => {
    const presenceChannel = this.pusherForPresence.channel(
      this.presenceChannelName,
    );
    if (presenceChannel && presenceChannel.subscribed) {
      presenceChannel.trigger('client-event-dock-user-idle', { idle: true });
    }
  };

  render() {
    const systemTimeout = parseInt(process.env.SYSTEM_TIMEOUT, 10);
    const idleTimeout = systemTimeout / 2;

    const { children } = this.props;
    const isLessThen1024 = window?.innerWidth < 1024;
    const orientationType = window?.screen?.orientation?.type;
    const showRotateScreenPage =
      isLessThen1024 &&
      ['portrait-primary', 'portrait-secondary', 'portrait'].includes(
        orientationType,
      );

    return (
      <AppContainer id="appHome">
        {!showRotateScreenPage && (
          <>
            <Modal />
            <ActivityAlertsToasts />
            <div className="new-task" />
            <IdleTimer
              ref={reference => {
                this.idleTimer = reference;
              }}
              element={document}
              onActive={this.onActive}
              onIdle={this.onIdle}
              onAction={this.onAction}
              debounce={250}
              timeout={systemTimeout}
            />
            <IdleTimer
              ref={reference => {
                this.idleTimerForPresence = reference;
              }}
              element={document}
              onActive={this.onActiveForPresence}
              onIdle={this.onIdleForPresence}
              debounce={250}
              timeout={idleTimeout}
            />
            <MainContainer>{children}</MainContainer>
            <Notification />
          </>
        )}
        {showRotateScreenPage && <RotateScreen />}
      </AppContainer>
    );
  }
}

App.propTypes = {
  children: node.isRequired,
};

const mapStateToProps = state => ({
  userState: state.userState,
});

const mapDispatchToProps = {
  setActiveUsers: activeUsers => ({
    type: 'active-users/setActiveUsers',
    activeUsers,
  }),
  addActiveUser: user => ({
    type: 'active-users/addActiveUser',
    user,
  }),
  addIdleUser: user => ({
    type: 'active-users/addIdleUser',
    user,
  }),
  removeUser: user => ({
    type: 'active-users/removeUser',
    user,
  }),
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
