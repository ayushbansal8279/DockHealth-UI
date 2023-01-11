/* eslint-disable unicorn/no-nested-ternary */
/* eslint-disable sonarjs/no-duplicate-string */
import 'normalize.css/normalize.css';
import 'simplebar/dist/simplebar.min.css';

import { node } from 'prop-types';
import React, { PureComponent } from 'react';
import isEmpty from 'ramda/src/isEmpty';
import { connect } from 'react-redux';
import IdleTimer from 'react-idle-timer';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import ReactModal from 'react-modal';
import { initializePusherForPresence } from 'helpers/pusher-instance';

import { openModal } from 'modal/actions';
import * as UserAuthApi from 'api/user-auth-api';
import WorkflowDrawer from 'components/workflow-drawer/WorkflowDrawer/WorkflowDrawer';
import Notification from 'components/common/Notification/Notification';
import ActivityAlertsToasts from 'components/activity-alerts/ActivityAlertsToasts';
import SendbirdProvider from '@sendbird/uikit-react/SendbirdProvider';
import palette, { featurePalette } from 'styles/palette';
// import { useMobile, useSmallScreen } from 'helpers/utility-functions';
import { useMobile } from 'helpers/utility-functions';
import Modal from '../modal/Modal';
import RotateScreen from './RotateScreen';
import MobileSmallScreen from './MobileSmallScreen';
import ChatActivityAlertsToasts from './chat/alerts/ChatActivityAlertsToasts';

const AppContainer = styled.div`
  font-family: 'Roboto', sans-serif;
  overflow-x: hidden;
  position: relative;
  @media print {
    overflow-x: initial;
  }
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

const sendbirdColorSet = {
  '--sendbird-light-primary-500': '#00487c',
  '--sendbird-light-primary-400': '#4bb3fd',
  '--sendbird-light-primary-300': palette.midnightBlue,
  '--sendbird-light-primary-200': '#0496ff',
  '--sendbird-light-primary-100': 'rgb(2, 123, 206, 0.12)',
};

ReactModal.setAppElement('#app');

const appId = process.env.SENDBIRD_APP_ID;

class App extends PureComponent {
  idleTimer = null;

  idleTimerForPresence = null;

  pusherForPresence = null;

  presenceChannelName = null;

  logoutTimeout = null;

  // eslint-disable-next-line react/no-deprecated
  componentWillMount() {
    const redirectToHome = JSON.parse(sessionStorage.getItem('redirectToHome'));
    const redirectToLink = sessionStorage.getItem('redirectToLink');

    if (redirectToHome && !redirectToLink) {
      sessionStorage.removeItem('redirectToHome');
      if (window.location.hash !== '#/core/home/my-tasks') {
        window.location.href = '#/core/home/my-tasks';
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
      setIdleStateForUser,
      removeActiveUser,
    } = this.props;

    const { userProfile: previousUserProfile } = previousUserState;
    const { userProfile } = userState;

    const pusherForPresence = initializePusherForPresence();
    this.pusherForPresence = pusherForPresence;
    if (isEmpty(previousUserProfile) && !isEmpty(userProfile)) {
      const presenceChannelName = `presence-dock-users-${userProfile.organizationIdentifier}`;
      this.presenceChannelName = presenceChannelName;
      let presenceChannel = pusherForPresence?.channel(presenceChannelName);
      if (
        pusherForPresence &&
        (!presenceChannel || !presenceChannel.subscribed)
      ) {
        presenceChannel = pusherForPresence?.subscribe(presenceChannelName);

        presenceChannel.bind('pusher:subscription_succeeded', function({
          members,
        }) {
          const formattedMembers = Object.keys(members)?.map(memberKey => ({
            ...members[memberKey],
            userIdentifier: memberKey,
            idle: false,
          }));

          setActiveUsers(formattedMembers);
        });

        presenceChannel.bind('pusher:member_added', function(member) {
          addActiveUser({
            ...member,
            userIdentifier: member.id,
            idle: false,
          });
        });

        presenceChannel.bind('pusher:member_removed', function(member) {
          removeActiveUser({
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
            setIdleStateForUser(
              {
                userIdentifier: metadata.user_id,
              },
              true,
            );
          } else {
            setIdleStateForUser(
              {
                userIdentifier: metadata.user_id,
              },
              false,
            );
          }
        });
      }
    }
  }

  logout = () => {
    const { history } = this.props;
    UserAuthApi.logout(history)
      .then(() => {
        sessionStorage.setItem('refreshOrgMemo', true);
      })
      .catch(() => {});

    history.push('/auth/login');
  };

  onAction = () => {};

  onActive = () => {};

  onIdle = () => {
    const { openModal: openModalAction } = this.props;
    // log out after 5min from showing modal
    const logoutTimeout = setTimeout(this.logout, 300000);

    openModalAction('AutoLogout', {
      onClose: () => {
        clearTimeout(logoutTimeout);
      },
      onLogout: this.logout,
    });
  };

  onActiveForPresence = () => {
    const presenceChannel = this.pusherForPresence?.channel(
      this.presenceChannelName,
    );
    if (presenceChannel && presenceChannel.subscribed) {
      presenceChannel.trigger('client-event-dock-user-idle', { idle: false });
    }
  };

  onIdleForPresence = () => {
    const presenceChannel = this.pusherForPresence?.channel(
      this.presenceChannelName,
    );
    if (presenceChannel && presenceChannel?.subscribed) {
      presenceChannel.trigger('client-event-dock-user-idle', { idle: true });
    }
  };

  render() {
    const isMobile = useMobile();
    // const isSmall = useSmallScreen();
    const isSmall = false;

    const {
      userState: { userProfile },
    } = this.props;

    const userOrganizations = userProfile?.userOrganizations;
    const selectedOrgIdentifier = userProfile?.organizationIdentifier;
    const currentOrganization =
      userOrganizations?.find(
        ({ organizationIdentifier }) =>
          organizationIdentifier === selectedOrgIdentifier,
      ) || null;
    const logoutTimeoutItem =
      currentOrganization?.themeSettings?.find(
        ({ name }) => name === 'logout.timeout',
      ) || {};
    const logoutTimeout = parseInt(logoutTimeoutItem?.value, 10);

    const systemTimeout =
      logoutTimeout > 0
        ? logoutTimeout
        : parseInt(process.env.SYSTEM_TIMEOUT, 10);
    const idleTimeout = systemTimeout / 2;

    const { children } = this.props;
    // const isLessThen1024 = window?.innerWidth < 1024;
    // const orientationType = window?.screen?.orientation?.type;
    // const showRotateScreenPage =
    //   isLessThen1024 &&
    //   ['portrait-primary', 'portrait-secondary', 'portrait'].includes(
    //     orientationType,
    //   );
    const showRotateScreenPage = false;

    const mountIdleTimer =
      userProfile &&
      !isEmpty(userProfile) &&
      userOrganizations &&
      !isEmpty(userOrganizations);
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const idleTimerReference = reference => {
      this.idleTimerForPresence = reference;
    };

    return (
      <AppContainer id="appHome">
        {isMobile && isSmall ? (
          <MobileSmallScreen />
        ) : !showRotateScreenPage ? (
          <>
            <SendbirdProvider
              appId={appId}
              userId={userProfile?.identifier}
              nickname={userProfile?.name}
              colorSet={sendbirdColorSet}
            >
              <div id="portal" />
              <Modal />
              <WorkflowDrawer />
              <ActivityAlertsToasts />

              <ChatActivityAlertsToasts />
              <div className="new-task" />
              {mountIdleTimer && (
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
              )}
              <IdleTimer
                ref={idleTimerReference}
                element={document}
                onActive={this.onActiveForPresence}
                onIdle={this.onIdleForPresence}
                debounce={250}
                timeout={idleTimeout}
              />
              <MainContainer>{children}</MainContainer>
              <Notification />
            </SendbirdProvider>
          </>
        ) : (
          <RotateScreen />
        )}
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
  setIdleStateForUser: (user, idleStatus) => ({
    type: 'active-users/setIdleStateForUser',
    user,
    idleStatus,
  }),
  removeActiveUser: user => ({
    type: 'active-users/removeActiveUser',
    user,
  }),
  openModal,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
