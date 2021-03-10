import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as TaskApi from 'api/task-api';

import CheckmarkYellow from 'img/checkmark-yellow';

import { closeGlobalAlert as closeAlertAction } from './actions';

import {
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
      alertState: { isGlobalOpen, transactionIdentifier },
    } = this.props;

    if (!isGlobalOpen && nextProps.alertState.isGlobalOpen) {
      if (nextProps.alertState.transactionIdentifier) {
        this.setCouterInterval();
      } else {
        this.setCloseTimeout(nextProps.alertState.transactionIdentifier);
      }
    }

    if (
      isGlobalOpen &&
      nextProps.alertState.isGlobalOpen &&
      !nextProps.alertState.transactionIdentifier
    ) {
      this.setCloseTimeout();
    }

    if (
      isGlobalOpen &&
      nextProps.alertState.isGlobalOpen &&
      nextProps.alertState.transactionIdentifier &&
      (nextProps.alertState.transactionIdentifier !== transactionIdentifier ||
        !transactionIdentifier)
    ) {
      this.setCouterInterval();
    }
  }

  handleCloseAlert = () => {
    if (this.timeoutHandle) clearTimeout(this.timeoutHandle);
    if (this.intervalHandle) clearInterval(this.intervalHandle);

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

  handleUndoClick = async () => {
    const {
      alertState: { undoCallback, transactionIdentifier },
    } = this.props;
    try {
      await TaskApi.rollbackTransaction(transactionIdentifier);
      undoCallback();
      this.handleCloseAlert();
    } catch {
      this.handleCloseAlert();
    }
  };

  render = () => {
    const {
      alertState: { isGlobalOpen, text, type, transactionIdentifier },
    } = this.props;

    const { counter } = this.state;

    return (
      <ChipContainer
        isOpen={isGlobalOpen}
        type={type}
        withUndo={transactionIdentifier}
      >
        <MainChipButton type="button" onClick={this.handleCloseAlert}>
          <CheckCircleIcon src={CheckmarkYellow} />
          <ChipText>{text}</ChipText>
        </MainChipButton>
        <UndoButton type="button" onClick={this.handleUndoClick}>
          <UndoButtonContent>
            <ChipText>UNDO</ChipText>
            <CounterContainer>
              <ChipText>{counter}</ChipText>
            </CounterContainer>
          </UndoButtonContent>
        </UndoButton>
        <ChipBackground />
      </ChipContainer>
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
