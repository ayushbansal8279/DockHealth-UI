import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  showGlobalAlert as showAlertAction,
  closeGlobalAlert as closeAlertAction,
} from './actions';

import {
  GlobalChipWrapper,
  ChipContainer,
  ChipLabel,
  ChipBackground,
  CheckCircleIcon,
} from './styled';
import AlertTypes from './AlertMessages';

class GlobalAlertChip extends Component {
  timeoutHandle;

  componentWillUpdate(nextProps) {
    const {
      alertState: { isGlobalOpen },
    } = this.props;

    if (!isGlobalOpen && nextProps.alertState.isGlobalOpen) {
      this.warnIfIsNotDefault(nextProps.alertState.text);
      this.setCloseTimeout();
    }

    if (isGlobalOpen && nextProps.alertState.isGlobalOpen) {
      if (this.timeoutHandle) clearTimeout(this.timeoutHandle);

      this.setCloseTimeout();
    }
  }

  warnIfIsNotDefault = text => {
    if (!Object.values(AlertTypes).includes(text)) {
      console.warn(
        'Notification message is not included in default messages list',
      );
    }
  };

  setCloseTimeout = (delay = 4000) => {
    const { closeAlert } = this.props;
    this.timeoutHandle = setTimeout(() => {
      closeAlert();
    }, delay);
  };

  handleCloseAlert = () => {
    if (this.timeoutHandle) clearTimeout(this.timeoutHandle);

    const { closeAlert } = this.props;
    closeAlert();
  };

  render = () => {
    const {
      alertState: { isGlobalOpen, text },
    } = this.props;

    return (
      <GlobalChipWrapper>
        <ChipContainer isOpen={isGlobalOpen} onClick={this.handleCloseAlert}>
          <CheckCircleIcon isOpen={isGlobalOpen} />
          <ChipLabel>{text}</ChipLabel>
          <ChipBackground />
        </ChipContainer>
      </GlobalChipWrapper>
    );
  };
}

const mapStateToProps = store => ({
  alertState: store.alertChip,
});

const mapDispatchToProps = {
  showAlert: showAlertAction,
  closeAlert: closeAlertAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(GlobalAlertChip);
