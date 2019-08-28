import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Moment from 'react-moment';
import { Link } from 'react-router';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

import { StyledTableCell } from './TaskList';
import DueDate from './DueDate';
import MemberPicker from './MemberPicker';
import Priority from './Priority';
import Subtasks from './SubTasks';
import Tag from './Tag';
import Flag from './Flag';
import Patient from './Patient';

const StyledTableBody = styled(({ isSubtask, isSelected, ...rest }) => <TableBody {...rest} />)`
  && {
    border: none;
    border-bottom: 8px solid  rgba(100,255,255,0);
    background-clip: padding-box;
    background-color: #fff;
    cursor: pointer;
    ${({ isSubtask }) => isSubtask && 'background-color: #f5f8fa;'}
    ${({ isSelected }) => isSelected && 'background-color: rgba(166, 220, 234, 0.39);'}

    :hover {
      background-color: rgba(166, 220, 234, 0.39);
    }
  }
`;

StyledTableBody.propTypes = {
  isSubtask: PropTypes.bool,
  isSelected: PropTypes.bool,
};

StyledTableBody.defaultProps = {
  isSubtask: false,
  isSelected: false,
};

const StyledCheckbox = styled(props => <Checkbox {...props} classes={{ checked: 'checked' }} />)`
  && {
    width: 36px;
    height: 36px;
  }
  &&.checked {
    color: #00a73c;
  }
`;

const StyledTaskDescription = styled.div`
  font-size: 14px;
  color: #303538;
  line-height: 18px;
  ${({ completed }) => completed && 'text-decoration: line-through;'}
`;

StyledTaskDescription.defaultProps = {
  completed: false,
};

const StyledTaskFooter = styled.div`
  font-size: 12px;
  color: #ababb2;
  line-height: 16px;
`;

const StyledTaskCommentCount = styled.div`
  font-size: 12px;
  color: #0ca1c7;
  line-height: 16px;
`;

const Info = ({ task }) => (
  <React.Fragment>
    {task.assignedBy !== null
      ? (
        <React.Fragment>
          {'Assigned by '}
          <Link to={`#/assignedToPerson/${task.assignedBy.userId}/${task.assignedBy.userName}`}>
            {`${task.assignedBy.firstName} ${task.assignedBy.lastName}`}
          </Link>
        </React.Fragment>
      )
      : (
        <Link to={`#/assignedToPerson/${task.creator.userId}/${task.creator.userName}`}>
          {`${task.creator.firstName} ${task.creator.lastName}`}
        </Link>
      )}
    {' • '}
    <Moment format="h:mma">
      {task.assignedBy !== null
        ? task.assignmentUpdatedDateTime
        : task.createdDateTime}
    </Moment>
  </React.Fragment>
);

const Comments = ({ comments }) => {
  if (comments === null || comments.length === 0) {
    return null;
  }

  return (
    <StyledTaskCommentCount>
      {comments.length}
      {' '}
      {comments.length === 1 ? 'comment' : 'comments'}
    </StyledTaskCommentCount>);
};

const UnnamedTask = styled.span`
  color: #ababb2;
`;

const Task = ({
  task, markComplete, storeAsCurrentTask, isSubtask, hideDate, hideTags, selectedTaskId,
}) => {
  // Check all subtasks confirmation dialog
  const [isOpen, setOpen] = useState(false);
  const open = useCallback(() => { setOpen(true); }, [setOpen]);
  const close = useCallback(() => { setOpen(false); }, [setOpen]);
  const confirm = useCallback(() => {
    const status = task.status === 'COMPLETE' ? 'COMPLETE' : 'INCOMPLETE';
    markComplete(task, status);
    close();
  }, [markComplete, task, close]);

  return (
    <StyledTableBody
      isSubtask={isSubtask}
      isSelected={selectedTaskId === task.taskId}
      onClick={(e) => {
        e.stopPropagation();
        storeAsCurrentTask(task.taskId);
      }}
    >
      <TableRow>
        <StyledTableCell
          align="center"
          style={{
            verticalAlign: 'top', margin: 0, padding: 0, width: 5,
          }}
        >
          <Flag priority={task.priority} />
        </StyledTableCell>
        <StyledTableCell align="center" style={{ width: 36 }}>
          <StyledCheckbox
            checked={task.status === 'COMPLETE'}
            onChange={() => {
              const hasSubtasks = task.subtasks?.length > 0;
              if (!hasSubtasks || task.status === 'COMPLETE') {
                confirm();
                return;
              }
              open();
            }}
            onClick={(e) => { e.stopPropagation(); }}
          />
          {!isSubtask && (
          <Dialog
            open={isOpen}
            onClose={close}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              You are about to complete a task with open subtasks.
              Completing the task will also complete the subtasks.
              Would you like to proceed?
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
          )}
        </StyledTableCell>
        <StyledTableCell align="center" style={{ width: 72 }}>
          <MemberPicker task={task} member={task.assignedTo} small={isSubtask} />
        </StyledTableCell>
        <StyledTableCell>
          <StyledTaskDescription completed={task.status === 'COMPLETE'}>{task.description || <UnnamedTask>Unnamed task</UnnamedTask>}</StyledTaskDescription>
          <StyledTaskFooter>
            <Info task={task} />
          </StyledTaskFooter>
          <Comments comments={task.comments} />
        </StyledTableCell>
        {!isSubtask && <StyledTableCell>
          {task.patient && <Link to={`/patient/${task.patient.patientId}`}><Patient patient={task.patient} style={{ color: '#0ca1c7' }} /></Link>}
        </StyledTableCell>}
        {!hideDate && (
        <StyledTableCell style={{ width: 108 }}>
          <DueDate completed={task.status === 'COMPLETE'}>{task.dueDate}</DueDate>
        </StyledTableCell>
        )}
        {!hideTags && (
        <StyledTableCell style={{ width: 216 }}>
          <Tag>Placeholder</Tag>
        </StyledTableCell>
        )}
        <StyledTableCell align="center" style={{ width: 36 }}>
          <Priority priority={task.workflowStatus} />
        </StyledTableCell>
      </TableRow>
      {
      task.subtasks
        && task.subtasks.length > 0
        && (
        <Subtasks
          parentTaskId={task.taskId}
          isCompleted={task.status === 'COMPLETE'}
          subtasks={task.subtasks}
          markComplete={markComplete}
          storeAsCurrentTask={storeAsCurrentTask}
          hideDate={hideDate}
          hideTags={hideTags}
          selectedTaskId={selectedTaskId}
        />
        )
    }
    </StyledTableBody>
  );
};

Task.propTypes = {
  isSubtask: PropTypes.bool,
  markComplete: PropTypes.func.isRequired,
  storeAsCurrentTask: PropTypes.func.isRequired,
  task: PropTypes.shape({
    taskId: PropTypes.number,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    dueDate: PropTypes.string,
    assignedTo: PropTypes.shape({
      userId: PropTypes.number,
      profileThumbnailPictureHash: PropTypes.string,
      initials: PropTypes.string,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
    }),
    assignedBy: PropTypes.shape({
      firstName: PropTypes.string,
      lastName: PropTypes.string,
    }),
    patient: PropTypes.shape({
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      mrn: PropTypes.string,
    }),
    comments: PropTypes.array,
    subtasks: PropTypes.array,
  }).isRequired,
};

Task.defaultProps = {
  isSubtask: false,
};

export default Task;
