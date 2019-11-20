import TableCell from '@material-ui/core/TableCell';
import moment from 'moment';
import PropTypes from 'prop-types';
import ascend from 'ramda/es/ascend';
import descend from 'ramda/es/descend';
import find from 'ramda/es/find';
import partition from 'ramda/es/partition';
import reverse from 'ramda/es/reverse';
import propEq from 'ramda/es/propEq';
import sortWith from 'ramda/es/sortWith';
import take from 'ramda/es/take';
import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { getPatientName } from '../../helpers/utilityFunctions';
import CheckIcon from '../../img/check.svg';
import SortingIcon from '../../img/sorting-icon.svg';
import CubesLoader from '../common/CubesLoader';
import Task from './Task';
import TaskCheckbox from './TaskCheckbox';

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

const SORTING_KEYS = {
  ASSIGNED_TO: 'ASSIGNED_TO',
  TASK: 'TASK',
  PATIENT: 'PATIENT',
  DUE_DATE: 'DUE_DATE',
  STATUS: 'STATUS',
};

const sortingColumns = [
  {
    key: SORTING_KEYS.ASSIGNED_TO,
    valueGetter: task => task.assignedTo?.userName ?? '',
  },
  {
    key: SORTING_KEYS.TASK,
    valueGetter: task => task.description,
  },
  {
    key: SORTING_KEYS.PATIENT,
    valueGetter: task => getPatientName(task.patient),
  },
  {
    key: SORTING_KEYS.DUE_DATE,
    valueGetter: task => moment(task.dueDate ?? '').format('YYYY-MM-DD'),
  },
  {
    key: SORTING_KEYS.STATUS,
    valueGetter: task => task.workflowStatus ?? '',
  },
];

const OrderIconContainer = styled.span`
  margin-left: 0.25rem;
`;

const OrderIconImage = styled.img`
  transform: rotate(${props => (props.rotated ? 180 : 0)}deg);
  transition: transform 0.25s ease-out;
`;

const OrderIcon = ({ sortingKey, sorting }) => {
  const { order } = find(propEq('key', sortingKey), sorting);

  return (
    <OrderIconContainer>
      <OrderIconImage
        rotated={order === 'desc'}
        src={SortingIcon}
        alt="Sort icon"
      />
    </OrderIconContainer>
  );
};

const Heading = ({ onSortingChanged, taskDrawerOpen, sorting }) => (
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
    <div style={{ width: '54px', textAlign: 'center', marginLeft: '5px' }}>
      <img
        src={CheckIcon}
        alt="Task status column"
        style={{ width: '21px', height: '17px' }}
      />
    </div>
    <div
      style={{ cursor: 'pointer', width: '90px', marginRight: '10px' }}
      onClick={onSortingChanged({ key: SORTING_KEYS.ASSIGNED_TO })}
    >
      <span>ASSIGNED</span>
      <OrderIcon sortingKey={SORTING_KEYS.ASSIGNED_TO} sorting={sorting} />
    </div>
    <div
      style={{ cursor: 'pointer', flex: 1 }}
      onClick={onSortingChanged({ key: SORTING_KEYS.TASK })}
    >
      <span>TASK</span>
      <OrderIcon sortingKey={SORTING_KEYS.TASK} sorting={sorting} />
    </div>
    {!taskDrawerOpen && (
      <div
        style={{ cursor: 'pointer', width: '218px' }}
        onClick={onSortingChanged({ key: SORTING_KEYS.PATIENT })}
      >
        <span>PATIENT</span>
        <OrderIcon sortingKey={SORTING_KEYS.PATIENT} sorting={sorting} />
      </div>
    )}
    {!taskDrawerOpen && (
      <div
        style={{ cursor: 'pointer', width: '180px' }}
        onClick={onSortingChanged({ key: SORTING_KEYS.DUE_DATE })}
      >
        <span>DUE</span>
        <OrderIcon sortingKey={SORTING_KEYS.DUE_DATE} sorting={sorting} />
      </div>
    )}
    {!taskDrawerOpen && (
      <div
        style={{ cursor: 'pointer', width: '80px' }}
        onClick={onSortingChanged({ key: SORTING_KEYS.STATUS })}
      >
        <span>STATUS</span>
        <OrderIcon sortingKey={SORTING_KEYS.STATUS} sorting={sorting} />
      </div>
    )}
  </div>
);

const ListEmptyElement = ({ addingNewTask }) => {
  if (addingNewTask) {
    return null;
  }

  return (
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
  );
};

const NewTaskContainer = styled.div`
  align-items: center;
  background-color: #fff;
  display: flex;
  height: ${props => (props.addingNewTask ? 85 : 0)};
  margin-top: ${props => (props.addingNewTask ? 0.5 : 0)}rem;
  overflow: hidden;
  transition: all ${props => (props.addingNewTask ? 0.25 : 0)}s ease-out;
  width: 100%;
`;

const NewTaskCheckboxContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  width: 60px;
`;

const NewTaskLoaderContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: flex-start;
  margin-left: 1rem;
`;

const ShowMoreButtonContainer = styled.div`
  height: ${props => (props.active ? 2.25 : 0)}rem;
  overflow: hidden;
  position: relative;
  transition: height 0.25s ease-out;
  width: 100%;
`;

const ShowMoreButton = styled.div`
  align-items: center;
  background-color: #d9036b;
  border-radius: 0 0 0.5rem 0.5rem;
  color: #fff;
  cursor: ${props => (props.active ? 'pointer' : 'not-allowed')};
  display: flex;
  font-size: 1.125rem;
  font-weight: 600;
  padding: 0 2rem;
  position: absolute;
  height: 2.25rem;
  justify-content: center;
  left: 50%;
  transform: translateX(-50%);
  top: ${props => (props.active ? 0 : -2.25)}rem;
  transition: top 0.25s ease-out;
`;

const NewTaskElement = props => {
  return (
    <NewTaskContainer {...props}>
      <NewTaskCheckboxContainer>
        <TaskCheckbox />
      </NewTaskCheckboxContainer>
      <NewTaskLoaderContainer>
        <CubesLoader size={32} />
      </NewTaskLoaderContainer>
    </NewTaskContainer>
  );
};

const TASK_LIST_SHOW_MORE_STEP = 5;

const DEFAULT_SORTING = [
  ...sortingColumns.map(sortingColumn => ({
    ...sortingColumn,
    order: 'asc',
  })),
];

const TaskList = ({ tasks = [], taskDrawerOpen, ...otherTaskListProps }) => {
  const addingNewTask = useSelector(store => store.taskState.addingNewTask);

  const [taskListShowMoreIndex, setTaskListShowMoreIndex] = useState(1);
  const [currentSorting, setCurrentSorting] = useState(DEFAULT_SORTING);

  const tasksToShow = take(
    TASK_LIST_SHOW_MORE_STEP * taskListShowMoreIndex,
    tasks,
  );
  const shouldhowShowMoreButton = tasksToShow.length < tasks.length;

  const incrementTaskListShowMoreIndex = useCallback(() => {
    if (shouldhowShowMoreButton) {
      setTaskListShowMoreIndex(taskListShowMoreIndex + 1);
    }
  }, [shouldhowShowMoreButton, taskListShowMoreIndex]);

  const onSortingChanged = useCallback(({ key }) => () => {
    const [[currentSortingColumn], otherSortingColumns] = partition(
      propEq('key', key),
      currentSorting,
    );

    const order = currentSortingColumn.order === 'asc' ? 'desc' : 'asc';

    setCurrentSorting([
      ...otherSortingColumns,
      {
        ...currentSortingColumn,
        order,
      },
    ]);
  });

  const sortingMethods = currentSorting.map(({ order, valueGetter }) =>
    (order === 'asc' ? ascend : descend)(valueGetter),
  );

  const sortedTasksToShow = sortWith(reverse(sortingMethods), tasksToShow);

  return (
    <div>
      <Heading
        taskDrawerOpen={taskDrawerOpen}
        onSortingChanged={onSortingChanged}
        sorting={currentSorting}
      />
      <NewTaskElement addingNewTask={addingNewTask} />
      {tasks.length === 0 ? (
        <ListEmptyElement addingNewTask={addingNewTask} />
      ) : (
        sortedTasksToShow.map(task => (
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
      <ShowMoreButtonContainer active={shouldhowShowMoreButton}>
        <ShowMoreButton
          onClick={incrementTaskListShowMoreIndex}
          active={shouldhowShowMoreButton}
        >
          Show more
        </ShowMoreButton>
      </ShowMoreButtonContainer>
    </div>
  );
};

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
