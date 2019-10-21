import React, { PureComponent } from 'react';

class NotificationModal extends PureComponent {
  componentDidUpdate() {
    const { uniqueId } = this.props;

    enableFoundationForSingleComponent(`#notification-modal-${uniqueId}`);
  }

  render() {
    const { message, uniqueId } = this.props;
    return (
      <div
        className="reveal text-center"
        id={`notification-modal-${uniqueId}`}
        data-reveal=""
      >
        <h5 className="margin-bottom">{message}</h5>
        <div className="button-wrapper">
          <span data-close="" className="button medium confirm">
            Got it
          </span>
        </div>
        <button
          className="close-button"
          data-close=""
          aria-label="Close modal"
          type="button"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    );
  }
}

export default NotificationModal;
