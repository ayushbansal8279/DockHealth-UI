import { PureComponent } from 'react';
import { connect } from 'react-redux';
import { error } from 'actions/notification-actions';
import * as UserAuthApi from 'api/user-auth-api';
import { initializePusherForPresence } from 'helpers/pusher-instance';

class Logout extends PureComponent {
  componentDidMount = () => {
    const { currentUser, history } = this.props;

    const pusherForPresence = initializePusherForPresence();
    const presenceChannelName = `presence-dock-users-${currentUser.organizationIdentifier}`;
    let presenceChannel = pusherForPresence?.channel(presenceChannelName);
    if (!presenceChannel || !presenceChannel.subscribed) {
      presenceChannel = pusherForPresence?.subscribe(presenceChannelName);
    }

    return UserAuthApi.logout(history)
      .then(() => {
        // eslint-disable-next-line no-unused-expressions
        pusherForPresence?.unsubscribe(presenceChannelName);
      })
      .catch(error_ => {
        error(error_ && error_.message ? error_.message : 'Could not logout.');
      });
  };

  render() {
    return null;
  }
}

const mapStateToProps = store => ({
  currentUser: store.userState.userProfile,
});

export default connect(mapStateToProps)(Logout);
