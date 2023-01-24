import React, { Component } from 'react';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import CloseIcon from '@material-ui/icons/Close';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import * as TaskApi from 'api/task-api';

import {
  closeGlobalAlert as closeAlertAction,
  showGlobalErrorAlert as showGlobalErrorAlertAction,
} from './actions';

import {
  ChipContainer,
  ChipText,
  ChipBackground,
  IconContainer,
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
      if (this.state.counter === 0) {
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
      showErrorAlert,
      alertState: { undoCallback, transactionIdentifier, options },
    } = this.props;
    this.handleCloseAlert();
    if (options?.preventRequest) {
      undoCallback(transactionIdentifier);
    } else {
      try {
        const rollbackResponse = await TaskApi.rollbackTransaction(
          transactionIdentifier,
        );
        undoCallback(rollbackResponse);
      } catch {
        showErrorAlert();
      }
    }
  };

  render = () => {
    const {
      alertState: { isGlobalOpen, text, type, transactionIdentifier },
      backgroundColor,
    } = this.props;

    const { counter } = this.state;

    return ReactDOM.createPortal(
      <ChipContainer
        isOpen={isGlobalOpen}
        type={type}
        withUndo={transactionIdentifier}
        backgroundColor={backgroundColor}
      >
        <MainChipButton type="button" onClick={this.handleCloseAlert}>
          <IconContainer>
            {type === 'error' ? <CloseIcon /> : <CheckCircleOutlineIcon />}
          </IconContainer>
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
      </ChipContainer>,
      document.querySelector('body'),
    );
  };
}

const mapStateToProps = store => ({
  alertState: store.alertChip,
});

const mapDispatchToProps = {
  closeAlert: closeAlertAction,
  showErrorAlert: showGlobalErrorAlertAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(GlobalAlertChip);
