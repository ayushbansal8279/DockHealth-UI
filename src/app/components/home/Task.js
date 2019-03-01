import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Moment from 'react-moment';
import { Link } from 'react-router';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';

import { StyledTableCell } from './TaskList';
import DueDate from './DueDate';
import MemberPicker from './MemberPicker';
import Priority from './Priority';
import Subtasks from './SubTasks';
import Tag from './Tag';
import SquareTag from './SquareTag';
import Bookmark from './Bookmark';
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

const Task = ({
  task, markComplete, storeAsCurrentTask, isSubtask, hideDate, hideTags, selectedTaskId,
}) => (
  <StyledTableBody
    isSubtask={isSubtask}
    isSelected={selectedTaskId === task.taskId}
    onClick={(e) => { e.stopPropagation(); storeAsCurrentTask(task.taskId); }}
  >
    <TableRow>
      <StyledTableCell align="center" style={{ width: 36 }}>
        <Priority priority={task.priority} />
      </StyledTableCell>
      <StyledTableCell align="center" style={{ width: 36 }}>
        <StyledCheckbox
          checked={task.status === 'COMPLETE'}
          onChange={(event) => {
            const status = event.target.checked ? 'INCOMPLETE' : 'COMPLETE';
            markComplete(task, status);
          }}
          onClick={(e) => { e.stopPropagation(); }}
        />
      </StyledTableCell>
      <StyledTableCell align="center" style={{ width: 72 }}>
        <MemberPicker task={task} member={task.assignedTo} small={isSubtask} />
      </StyledTableCell>
      <StyledTableCell>
        <StyledTaskDescription completed={task.status === 'COMPLETE'}>{task.description}</StyledTaskDescription>
        <StyledTaskFooter>
          <SquareTag background="#ff585b">New</SquareTag>
          <SquareTag>Updated</SquareTag>
          <Info task={task} />
        </StyledTaskFooter>
        <Comments comments={task.comments} />
      </StyledTableCell>
      <StyledTableCell>
        {task.patient && <Patient patient={task.patient} />}
      </StyledTableCell>
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
      <StyledTableCell align="center" style={{ verticalAlign: 'top', width: 36 }}>
        {task.priority === 'HIGH' && <Bookmark style={{ marginTop: -4 }} isActive />}
      </StyledTableCell>
    </TableRow>
    {
      task.subtasks
        && task.subtasks.length > 0
        && (
        <Subtasks
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
