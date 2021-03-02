import React, { Component } from 'react';
import { connect } from 'react-redux';

import CheckmarkYellow from 'img/checkmark-yellow';

import { closeGlobalAlert as closeAlertAction } from './actions';

import {
  GlobalChipWrapper,
  ChipContainer,
  ChipText,
  ChipBackground,
  CheckCircleIcon,
  UndoButton,
  MainChipButton,
  CounterContainer,
  UndoButtonContent,
} from './styled';

class GlobalAlertChip extends Component {
  timeoutHandle;

  intervalHandle;

  state = {
    counter: 10,
  };

  // eslint-disable-next-line sonarjs/cognitive-complexity
  UNSAFE_componentWillUpdate(nextProps) {
    const {
      alertState: { isGlobalOpen, transactionId },
    } = this.props;

    if (!isGlobalOpen && nextProps.alertState.isGlobalOpen) {
      if (nextProps.alertState.transactionId) {
        this.setCouterInterval();
      } else {
        this.setCloseTimeout(nextProps.alertState.transactionId);
      }
    }

    if (
      isGlobalOpen &&
      nextProps.alertState.isGlobalOpen &&
      !nextProps.alertState.transactionId
    ) {
      this.setCloseTimeout();
    }

    if (
      isGlobalOpen &&
      nextProps.alertState.isGlobalOpen &&
      nextProps.alertState.transactionId &&
      (nextProps.alertState.transactionId !== transactionId || !transactionId)
    ) {
      this.setCouterInterval();
    }
  }

  handleCloseAlert = () => {
    if (this.timeoutHandle) clearTimeout(this.timeoutHandle);
    if (this.intervalHandle) clearInterval(this.clearInterval);

    const { closeAlert } = this.props;
    closeAlert();
  };

  setCloseTimeout = () => {
    if (this.intervalHandle) clearInterval(this.intervalHandle);
    if (this.timeoutHandle) clearTimeout(this.timeoutHandle);

    this.timeoutHandle = setTimeout(() => {
      this.handleCloseAlert();
    }, 4000);
  };

  setCouterInterval = () => {
    this.setState({ counter: 10 });
    if (this.intervalHandle) clearInterval(this.intervalHandle);
    if (this.timeoutHandle) clearTimeout(this.timeoutHandle);

    this.intervalHandle = setInterval(() => {
      // eslint-disable-next-line react/destructuring-assignment
      if (this.state.counter === 1) {
        this.handleCloseAlert();
      } else {
        this.setState(({ counter: previousCounter }) => ({
          counter: previousCounter - 1,
        }));
      }
    }, 1000);
  };

  handleUndoClick = () => {
    const {
      alertState: { undoCallback },
    } = this.props;
    undoCallback();
    this.handleCloseAlert();
  };

  render = () => {
    const {
      alertState: { isGlobalOpen, isSideBarAlert, text, type, transactionId },
    } = this.props;

    const { counter } = this.state;

    return (
      <GlobalChipWrapper isSideBarAlert={isSideBarAlert}>
        <ChipContainer isOpen={isGlobalOpen}>
          <MainChipButton type="button" onClick={this.handleCloseAlert}>
            {type === 'success' && (
              <CheckCircleIcon src={CheckmarkYellow} isOpen={isGlobalOpen} />
            )}
            <ChipText>{text}</ChipText>
          </MainChipButton>
          <UndoButton
            isVisible={transactionId}
            type="button"
            onClick={this.handleUndoClick}
          >
            <UndoButtonContent>
              <ChipText>UNDO</ChipText>
              <CounterContainer>
                <ChipText>{counter}</ChipText>
              </CounterContainer>
            </UndoButtonContent>
          </UndoButton>
          <ChipBackground type={type} />
        </ChipContainer>
      </GlobalChipWrapper>
    );
  };
}

const mapStateToProps = store => ({
  alertState: store.alertChip,
});

const mapDispatchToProps = {
  closeAlert: closeAlertAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(GlobalAlertChip);
