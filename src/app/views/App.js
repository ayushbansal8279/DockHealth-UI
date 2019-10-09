import React from 'react';
import PropTypes from 'prop-types';
import IdleTimer from 'react-idle-timer';
import { hashHistory } from 'react-router';
import Notification from '../components/common/Notification';
import * as userApi from '../api/user-api';
import { mobileAnalyticsClient } from '../api/analytics-api';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.idleTimer = null;
    this.onAction = this._onAction.bind(this);
    this.onActive = this._onActive.bind(this);
    this.onIdle = this._onIdle.bind(this);
  }

  render() {
    const systemTimeout = parseInt(process.env.SYSTEM_TIMEOUT);

    return (
      <div id="appHome">
        <IdleTimer
          ref={(ref) => { this.idleTimer = ref; }}
          element={document}
          onActive={this.onActive}
          onIdle={this.onIdle}
          onAction={this.onAction}
          debounce={250}
          timeout={systemTimeout}
        />
        <main>
          {this.props.children}
        </main>
        <Notification />
      </div>
    );
  }

  componentDidMount() {
    this.renderFoundationComponents();
  }

  componentDidUpdate() {
    this.renderFoundationComponents();
  }

  renderFoundationComponents() {
  // render the buy button with jQuery
    renderFoundationComponentsJquery();
  }

  _onAction(e) {
    console.log('user did something', e);
  }

  _onActive(e) {
    console.log('user is active', e);
    console.log('time remaining', this.idleTimer.getRemainingTime());
  }

  _onIdle(e) {
    console.log(`${new Date()}: - user is idle`, e);
    console.log('last active', this.idleTimer.getLastActiveTime());
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

    hashHistory.push('/login');
  }
}

App.propTypes = {
  children: PropTypes.object.isRequired,
};

export default App;
