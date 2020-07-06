import React, { Component } from 'react';
import { connect } from 'react-redux';

import CheckmarkYellow from 'img/checkmark-yellow';

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

class GlobalAlertChip extends Component {
  timeoutHandle;

  componentWillUpdate(nextProps) {
    const {
      alertState: { isGlobalOpen },
    } = this.props;

    if (!isGlobalOpen && nextProps.alertState.isGlobalOpen) {
      this.setCloseTimeout();
    }

    if (isGlobalOpen && nextProps.alertState.isGlobalOpen) {
      if (this.timeoutHandle) clearTimeout(this.timeoutHandle);

      this.setCloseTimeout();
    }
  }

  setCloseTimeout = () => {
    const { closeAlert } = this.props;
    this.timeoutHandle = setTimeout(() => {
      closeAlert();
    }, 4000);
  };

  handleCloseAlert = () => {
    if (this.timeoutHandle) clearTimeout(this.timeoutHandle);

    const { closeAlert } = this.props;
    closeAlert();
  };

  render = () => {
    const {
      alertState: { isGlobalOpen, isSideBarAlert, text, type },
    } = this.props;

    return (
      <GlobalChipWrapper isSideBarAlert={isSideBarAlert}>
        <ChipContainer isOpen={isGlobalOpen} onClick={this.handleCloseAlert}>
          {type === 'success' &&
            <CheckCircleIcon src={CheckmarkYellow} isOpen={isGlobalOpen} />
          }
          <ChipLabel>{text}</ChipLabel>
          <ChipBackground type={type}/>
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
