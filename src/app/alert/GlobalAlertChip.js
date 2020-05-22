import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  showGlobalAlert as showAlertAction,
  closeGlobalAlert as closeAlertAction,
} from './actions';

import {
  GlobalChipWrapper,
  ChipContainer,
  StyledChip,
  CheckCircleIcon,
} from './styled';
import AlertTypes from './AlertTypes';

class GlobalAlertChip extends Component {
  timeoutHandle;

  componentWillUpdate(nextProps) {
    const {
      alertState: { isGlobalOpen, text },
    } = this.props;

    if (
      !Object.values(AlertTypes).includes(text) &&
      nextProps.alertState.isGlobalOpen
    ) {
      console.warn(
        'Notification message is not included in default messages list',
      );
    }

    if (!isGlobalOpen && nextProps.alertState.isGlobalOpen) {
      this.setCloseTimeout();
    }

    if (isGlobalOpen && nextProps.alertState.isGlobalOpen) {
      if (this.timeoutHandle) {
        clearTimeout(this.timeoutHandle);
      }

      this.setCloseTimeout();
    }
  }

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
          <StyledChip
            variant="outlined"
            icon={<CheckCircleIcon />}
            label={text}
          />
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
