import 'normalize.css/normalize.css';
import 'animate.css/animate.min.css';

import { node } from 'prop-types';
import React, { PureComponent } from 'react';
import IdleTimer from 'react-idle-timer';
import { hashHistory } from 'react-router';
import styled from 'styled-components';

import { mobileAnalyticsClient } from '../api/analytics-api';
import * as userApi from '../api/user-api';
import Notification from '../components/common/Notification';

const AppContainer = styled.div`
  &&& * {
    font-family: 'Open Sans', sans-serif;
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
`;

class App extends PureComponent {
  idleTimer = null;

  componentDidMount() {
    this.renderFoundationComponents();
  }

  componentDidUpdate() {
    this.renderFoundationComponents();
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

  // eslint-disable-next-line class-methods-use-this
  renderFoundationComponents() {
    renderFoundationComponentsJquery();
  }

  render() {
    const systemTimeout = parseInt(process.env.SYSTEM_TIMEOUT, 10);
    const { children } = this.props;

    return (
      <AppContainer id="appHome">
        <div className="new-task" />
        <IdleTimer
          ref={ref => {
            this.idleTimer = ref;
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
      </AppContainer>
    );
  }
}

App.propTypes = {
  children: node.isRequired,
};

export default App;
