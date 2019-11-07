import TableCell from '@material-ui/core/TableCell';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import CheckIcon from '../../img/check.svg';
import Task from './Task';

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

const Heading = ({ taskDrawerOpen }) => (
  <div
    style={{
      height: '32px',
      marginBottom: '5px',
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'row',
      background: 'white',
      fontSize: '14px',
      fontWeight: 600,
    }}
  >
    <div style={{ width: '60px', textAlign: 'center', marginLeft: '5px' }}>
      <img
        src={CheckIcon}
        alt="Task status column"
        style={{ width: '21px', height: '17px' }}
      />
    </div>
    <div style={{ width: '90px', marginRight: '10px' }}>ASSIGNED</div>
    <div style={{ flex: 1 }}>TASK</div>
    <div style={{ width: '140px', marginRight: '24px' }}>PATIENT</div>
    {!taskDrawerOpen && (
      <div style={{ width: '140px', marginRight: '24px' }}>DUE</div>
    )}
    {!taskDrawerOpen && (
      <>
        <div style={{ width: '90px' }}>STATUS</div>
        <div style={{ width: '120px', marginRight: '24px' }} />
      </>
    )}
  </div>
);

const TaskList = ({ tasks = [], taskDrawerOpen, ...otherTaskListProps }) => (
  <div>
    <Heading taskDrawerOpen={taskDrawerOpen} />
    {tasks.length === 0 ? (
      <div
        style={{
          textAlign: 'center',
          verticalAlign: 'middle',
          height: '32px',
          lineHeight: '32px',
          background: 'white',
        }}
      >
        List is empty.
      </div>
    ) : (
      tasks.map(task => (
        <Task
          {...{
            task,
            isSubtask: task.parentTaskId !== null,
            taskDrawerOpen,
            key: task.taskId,
            ...otherTaskListProps,
          }}
        />
      ))
    )}
  </div>
);

TaskList.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
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
    }),
  ).isRequired,
};

export { StyledTableCell };
export default TaskList;
