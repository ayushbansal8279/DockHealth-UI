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

class App extends PureComponent {
  idleTimer = null;

  componentDidMount() {
    this.renderFoundationComponents();
  }

  componentDidUpdate() {
    this.renderFoundationComponents();
  }

  onAction = (e) => {
    console.log('user did something', e);
  };

  onActive = (e) => {
    console.log('user is active', e);
    console.log('time remaining', this.idleTimer.getRemainingTime());
  };

  onIdle = (e) => {
    console.log(`${new Date()}: - user is idle`, e);
    console.log('last active', this.idleTimer.getLastActiveTime());
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
    // render the buy button with jQuery
    renderFoundationComponentsJquery();
  }

  render() {
    const systemTimeout = parseInt(process.env.SYSTEM_TIMEOUT, 10);
    const { children } = this.props;

    return (
      <AppContainer id="appHome">
        <IdleTimer
          ref={(ref) => {
            this.idleTimer = ref;
          }}
          element={document}
          onActive={this.onActive}
          onIdle={this.onIdle}
          onAction={this.onAction}
          debounce={250}
          timeout={systemTimeout}
        />
        <main>{children}</main>
        <Notification />
      </AppContainer>
    );
  }
}

App.propTypes = {
  children: node.isRequired,
};

export default App;
