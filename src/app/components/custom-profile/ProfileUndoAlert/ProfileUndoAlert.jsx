import React, { useState, useEffect, useRef, useCallback } from 'react';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import { useSelector, useDispatch } from 'react-redux';
import ReactDOM from 'react-dom';

import {
  showGlobalErrorAlert as showGlobalErrorAlertAction,
} from '@/app/alert/actions';
import { hideProfileUndo } from '@/app/actions/profile-actions';

import {
  ChipContainer,
  ChipText,
  ChipBackground,
  IconContainer,
  UndoButton,
  MainChipButton,
  CounterContainer,
  UndoButtonContent,
} from '@/app/alert/styled';

const ProfileUndoAlert = ({ onUndo, backgroundColor }) => {
  const dispatch = useDispatch();
  const undoOperation = useSelector((store) => store.profile?.undoOperation);
  
  const [counter, setCounter] = useState(10);
  const timeoutHandle = useRef(null);
  const intervalHandle = useRef(null);
  const prevUndoOperation = useRef(undoOperation);

  const handleCloseAlert = useCallback(() => {
    if (timeoutHandle.current) clearTimeout(timeoutHandle.current);
    if (intervalHandle.current) clearInterval(intervalHandle.current);

    dispatch(hideProfileUndo());
  }, [dispatch]);

  const setCouterInterval = useCallback(() => {
    setCounter(10);
    if (intervalHandle.current) clearInterval(intervalHandle.current);
    if (timeoutHandle.current) clearTimeout(timeoutHandle.current);

    intervalHandle.current = setInterval(() => {
      setCounter((prevCounter) => {
        if (prevCounter === 0) {
          handleCloseAlert();
          return 0;
        }
        return prevCounter - 1;
      });
    }, 1000);
  }, [handleCloseAlert]);

  const handleUndoClick = useCallback(async () => {
    handleCloseAlert();
    
    try {
      onUndo(undoOperation);
    } catch {
      dispatch(showGlobalErrorAlertAction());
    }
  }, [handleCloseAlert, onUndo, undoOperation, dispatch]);

  useEffect(() => {
    if (!prevUndoOperation.current && undoOperation) {
      setCouterInterval();
    }

    if (
      prevUndoOperation.current &&
      undoOperation &&
      undoOperation.timestamp !== prevUndoOperation.current.timestamp
    ) {
      setCouterInterval();
    }

    prevUndoOperation.current = undoOperation;
  }, [undoOperation, setCouterInterval]);

  useEffect(() => {
    return () => {
      if (timeoutHandle.current) clearTimeout(timeoutHandle.current);
      if (intervalHandle.current) clearInterval(intervalHandle.current);
    };
  }, []);

  if (!undoOperation) {
    return null;
  }

  const getMessage = () => {
    if (undoOperation.operationType === 'ARCHIVE') {
      return 'Archived';
    } else if (undoOperation.operationType === 'DELETE') {
      return 'Deleted';
    }
    return 'Operation completed';
  };

  return ReactDOM.createPortal(
    <ChipContainer
      isOpen={true}
      type="success"
      withUndo={true}
      backgroundColor={backgroundColor}
    >
      <MainChipButton type="button" onClick={handleCloseAlert}>
        <IconContainer>
          <CheckCircleOutlineIcon />
        </IconContainer>
        <ChipText>{getMessage()}</ChipText>
      </MainChipButton>
      <UndoButton type="button" onClick={handleUndoClick}>
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

export default ProfileUndoAlert;
