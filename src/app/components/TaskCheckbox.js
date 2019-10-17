import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import React, { useCallback } from 'react';
import styled from 'styled-components';

import useBoolean from '../helpers/useBoolean';
import CompleteIcon from '../img/checkbox-complete.svg';
import IncompleteIcon from '../img/checkbox-incomplete.svg';

const StyledImg = styled.img`
  width: 30px;
  height: 30px;
`;

const icon = () => <StyledImg src={IncompleteIcon} />;

const checkedIcon = () => <StyledImg src={CompleteIcon} />;

const StyledCheckbox = styled(Checkbox).attrs({
  classes: { checked: 'checked' },
  icon,
  checkedIcon,
  // disableRipple: true,
})`
  &&.checked {
    color: #00a73c;
  }
`;

export const useConfirmation = (task, markComplete) => {
  const { status, subtasks } = task;

  const [isOpen, open, close] = useBoolean(false);
  const confirm = useCallback(
    () => {
      const updatedStatus = status === 'COMPLETE' ? 'COMPLETE' : 'INCOMPLETE';
      markComplete(task, updatedStatus);
      close();
    },
    [status, markComplete, task, close],
  );

  const handleStatusChange = () => {
    const hasSubtasks = subtasks?.length > 0;
    if (
      status === 'COMPLETE'
      || !hasSubtasks
      || subtasks.every(subtask => subtask.status === 'COMPLETE')
    ) {
      confirm();
      return;
    }
    open();
  };

  return {
    handleStatusChange,
    isOpen,
    close,
    confirm,
  };
};

export const Confirmation = ({ isOpen, close, confirm }) => (
  <Dialog
    open={isOpen}
    onClose={close}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
  >
    <DialogTitle id="alert-dialog-title">
      You are about to complete a task with open subtasks. Completing the task will also complete
      the subtasks. Would you like to proceed?
    </DialogTitle>
    <DialogActions>
      <Button onClick={close} color="primary">
        Cancel
      </Button>
      <Button onClick={confirm} color="primary" autoFocus>
        Complete all
      </Button>
    </DialogActions>
  </Dialog>
);

const TaskCheckbox = ({
  checked, onChange, onClick = () => {}, disabled, style,
}) => (
  <StyledCheckbox
    checked={checked}
    onChange={onChange}
    onClick={onClick}
    disabled={disabled}
    style={style}
  />
);

export default TaskCheckbox;
