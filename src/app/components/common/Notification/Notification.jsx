import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as NotificationActions from 'actions/notification-actions';

class Notification extends React.Component {
  onClose() {
    const { actions } = this.props;
    actions.hide('');
  }

  render() {
    const { type, message, hidden, stay } = this.props;
    if (!type) {
      return null;
    }
    const classes = ['Notification', 'message'];
    if (type === 'info') {
      classes.push('is-info');
    }
    if (type === 'success') {
      classes.push('is-success');
    }
    if (type === 'error') {
      classes.push('is-danger');
    }
    if (hidden) {
      classes.push('hidden');
    }
    return (
      <div className={classes.join(' ')}>
        <div className="message-body">
          {message}
          {stay ?? (
            // eslint-disable-next-line jsx-a11y/control-has-associated-label
            <button
              style={{ marginLeft: 5 }}
              onClick={this.onClose}
              className="delete"
              type="button"
            />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (store) => ({
  message: store.notification.message,
  type: store.notification.type,
  hidden: store.notification.hidden,
  stay: store.notification.stay,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(NotificationActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Notification);
