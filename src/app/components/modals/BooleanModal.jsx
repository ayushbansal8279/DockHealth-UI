import React from 'react';

class BooleanModal extends React.Component {
  shouldComponentUpdate(nextProps) {
    const { uniqueModalId } = this.props;
    return uniqueModalId !== nextProps.uniqueModalId;
  }

  componentWillUnmount() {
    const { uniqueModalId } = this.props;
    // removeRevealComponent(`#${uniqueModalId}`);
  }

  closeDialog() {
    const { uniqueModalId } = this.props;
    // closePopup(`#${uniqueModalId}`);
  }

  render() {
    const {
      confirmBtnTxt,
      message,
      uniqueModalId,
      handleConfirmationArgs,
      handleConfirmation,
    } = this.props;

    return (
      <div className="reveal text-center" id={uniqueModalId} data-reveal="">
        <h5 className="margin-bottom">{message}</h5>
        <div className="button-wrapper">
          <span
            data-close=""
            onClick={() => handleConfirmation(handleConfirmationArgs)}
            className="button medium confirm"
          >
            {confirmBtnTxt}
          </span>
          <div
            data-close=""
            onClick={this.closeDialog}
            className="button medium cancel"
          >
            Cancel
          </div>
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

export default BooleanModal;
