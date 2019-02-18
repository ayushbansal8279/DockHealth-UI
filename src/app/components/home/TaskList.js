import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import CheckIcon from '@material-ui/icons/Check';

import Task from './Task';
import Priority from './Priority';

const StyledTable = styled(Table)`
  && {
    border: none;
    border-collapse: collapse;
    padding: 0 8px;
    
    table {
      margin-bottom: 0;
    }
  }
`;

const StyledTableRow = styled(TableRow)``;

const StyledTableHead = styled(TableHead)`
  && {
    border: none;
    border-bottom: 8px solid  transparent;
    background-clip: padding-box;
    background-color: #fff;
  
    ${StyledTableRow} {
      height: 32px;
      color: #303538;
    }
  }
`;

const StyledTableCell = styled(TableCell)`
  && {
    border: none;
    padding-right: 0;
    padding-left: 0;

    :last-child {
      padding-right: 0;
    }
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

const TaskList = ({
  tasks = [], markComplete, storeAsCurrentTask, hideDate, hideTags, selectedTaskId,
}) => (
  <StyledTable padding="dense">
    <StyledTableHead>
      <StyledTableRow>
        <StyledTableCell align="center">
          <Priority />
        </StyledTableCell>
        <StyledTableCell align="center">
          <CheckIcon />
        </StyledTableCell>
        <StyledTableCell align="center">ASSIGNED</StyledTableCell>
        <StyledTableCell><strong>TASK</strong></StyledTableCell>
        <StyledTableCell>PATIENT</StyledTableCell>
        {!hideDate && <StyledTableCell>DUE DATE</StyledTableCell>}
        {!hideTags && <StyledTableCell>TAGS</StyledTableCell>}
        <StyledTableCell align="center" style={{ width: 64 }} />
      </StyledTableRow>
    </StyledTableHead>
    {tasks.length === 0
      ? <tbody><tr><td colSpan="9" style={{ textAlign: 'center', height: '32' }}>List is empty.</td></tr></tbody>
      : tasks.map(task => (
        <Task
          task={task}
          markComplete={markComplete}
          storeAsCurrentTask={storeAsCurrentTask}
          hideDate={hideDate}
          hideTags={hideTags}
          selectedTaskId={selectedTaskId}
          key={task.taskId}
        />
      ))}
  </StyledTable>
);

TaskList.propTypes = {
  tasks: PropTypes.arrayOf(PropTypes.shape({
    taskId: PropTypes.number,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    dueDate: PropTypes.string,
    assignedTo: PropTypes.shape({
      profileThumbnailPictureHash: PropTypes.string,
      initials: PropTypes.string,
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
  })).isRequired,
};

export { StyledTableCell };
export default TaskList;
