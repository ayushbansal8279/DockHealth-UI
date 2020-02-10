import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { deleteTask, duplicateTask } from '../../actions/task-actions';
import useDialog from '../../hooks/useDialog';
import NoOverflowDialog from '../common/NoOverflowDialog';

const Container = styled.div`
  display: flex;
  justify-content: center;
`;

const ActionButton = styled(ButtonBase)`
  && {
    font-size: 14px;
    color: #13a7d1;
    padding: 8px;
    border-radius: 4px;
  }
`;

const Divider = styled.div`
  ::before {
    content: ' | ';
    color: #a9b8c5;
    font-size: 14px;
    line-height: 28px;
  }
`;

const TaskActions = ({ remove, duplicate }) => {
  const { isOpen, open, close, confirm } = useDialog(remove);

  return (
    <Container>
      <ActionButton onClick={open}>Delete</ActionButton>
      <Divider />
      <ActionButton onClick={duplicate}>Duplicate</ActionButton>
      <NoOverflowDialog
        open={isOpen}
        onClose={close}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Are you sure you want to delete this task?
        </DialogTitle>
        <DialogActions>
          <Button onClick={close} color="primary">
            Cancel
          </Button>
          <Button onClick={confirm} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </NoOverflowDialog>
    </Container>
  );
};

TaskActions.propTypes = {
  remove: PropTypes.func.isRequired,
  duplicate: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch, { task }) => ({
  remove: () =>
    deleteTask({
      taskIdentifier: task.taskIdentifier,
      parentTaskIdentifier: task.parentTaskIdentifier,
    })(dispatch),
  duplicate: () =>
    duplicateTask({ taskIdentifier: task.taskIdentifier })(dispatch),
});

const ConnectedTaskActions = connect(
  undefined,
  mapDispatchToProps,
)(TaskActions);

ConnectedTaskActions.propTypes = {
  task: PropTypes.shape({
    taskIdentifier: PropTypes.string.isRequired,
  }),
};

export default ConnectedTaskActions;
