import 'normalize.css/normalize.css';
import 'simplebar/dist/simplebar.min.css';

import { node } from 'prop-types';
import React, { PureComponent } from 'react';
import IdleTimer from 'react-idle-timer';
import { hashHistory } from 'react-router';
import styled from 'styled-components';
import ReactModal from 'react-modal';

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

  componentWillMount() {
    const redirectToHome = JSON.parse(sessionStorage.getItem('redirectToHome'));
    if (redirectToHome) {
      if (window.location.hash !== '#/home/my-tasks') {
        window.location.href = '#/home/my-tasks';
      }
      sessionStorage.setItem('redirectToHome', false);
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

  render() {
    const systemTimeout = parseInt(process.env.SYSTEM_TIMEOUT, 10);
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

export default App;
