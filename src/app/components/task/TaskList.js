import moment from 'moment';
import PropTypes from 'prop-types';
import ascend from 'ramda/es/ascend';
import descend from 'ramda/es/descend';
import partition from 'ramda/es/partition';
import propEq from 'ramda/es/propEq';
import reverse from 'ramda/es/reverse';
import sortWith from 'ramda/es/sortWith';
import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getTaskPage } from '../../actions/task-actions';
import { getPatientName } from '../../helpers/utilityFunctions';
import CubesLoader from '../common/CubesLoader';
import Task from './Task';
import NewTaskElement from './TaskList.NewTaskElement';
import OrderIcon from './TaskList.OrderIcon';
import {
  HeadingAssignedToContainer,
  HeadingContainer,
  HeadingDueDateContainer,
  HeadingPatientContainer,
  HeadingStatusContainer,
  HeadingTaskContainer,
  ShowMoreButton,
  ShowMoreButtonContainer,
  StyledTableCell,
  TaskListOuterContainer,
} from './TaskList.styled';

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

const Heading = ({ onSortingChanged, taskDrawerOpen, sorting }) => (
  <HeadingContainer>
    <HeadingAssignedToContainer
      onClick={onSortingChanged({ key: SORTING_KEYS.ASSIGNED_TO })}
    >
      <span>ASSIGNED</span>
      <OrderIcon sortingKey={SORTING_KEYS.ASSIGNED_TO} sorting={sorting} />
    </HeadingAssignedToContainer>
    <HeadingTaskContainer
      onClick={onSortingChanged({ key: SORTING_KEYS.TASK })}
    >
      <span>TASK</span>
      <OrderIcon sortingKey={SORTING_KEYS.TASK} sorting={sorting} />
    </HeadingTaskContainer>
    {!taskDrawerOpen && (
      <HeadingPatientContainer
        onClick={onSortingChanged({ key: SORTING_KEYS.PATIENT })}
      >
        <span>PATIENT</span>
        <OrderIcon sortingKey={SORTING_KEYS.PATIENT} sorting={sorting} />
      </HeadingPatientContainer>
    )}
    {!taskDrawerOpen && (
      <HeadingDueDateContainer
        style={{ cursor: 'pointer', width: '180px' }}
        onClick={onSortingChanged({ key: SORTING_KEYS.DUE_DATE })}
      >
        <span>DUE</span>
        <OrderIcon sortingKey={SORTING_KEYS.DUE_DATE} sorting={sorting} />
      </HeadingDueDateContainer>
    )}
    {!taskDrawerOpen && (
      <HeadingStatusContainer
        onClick={onSortingChanged({ key: SORTING_KEYS.STATUS })}
      >
        <span>STATUS</span>
        <OrderIcon sortingKey={SORTING_KEYS.STATUS} sorting={sorting} />
      </HeadingStatusContainer>
    )}
  </HeadingContainer>
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

const TASK_LIST_SHOW_MORE_STEP = 100;

const DEFAULT_SORTING = [
  ...sortingColumns.map(sortingColumn => ({
    ...sortingColumn,
    order: 'asc',
  })),
];

const TaskList = ({
  tasks = [],
  taskDrawerOpen,
  taskListId,
  status,
  search,
  filterBy,
  isInbox,
  listName,
  ...otherTaskListProps
}) => {
  const addingNewTask = useSelector(store => store.taskState.addingNewTask);
  const newlyAddedTaskIds = useSelector(
    store => store.taskState.newlyAddedTaskIds,
  );

  const dispatch = useDispatch();

  if (otherTaskListProps.listTasks) {
    // eslint-disable-next-line no-param-reassign
    tasks = otherTaskListProps.listTasks;
  }

  const [taskListShowMoreIndex, setTaskListShowMoreIndex] = useState(1);
  const [isShowMoreLocked, setShowMoreLocked] = useState(false);
  const [currentSorting, setCurrentSorting] = useState(DEFAULT_SORTING);

  const [newlyAddedTasks, tasksToShow] = partition(
    ({ taskId }) => newlyAddedTaskIds.includes(taskId),
    tasks,
  );

  const showMoreButtonVisible =
    taskListShowMoreIndex * TASK_LIST_SHOW_MORE_STEP < tasks.length &&
    (taskListId || isInbox);

  const incrementTaskListShowMoreIndex = useCallback(() => {
    if (showMoreButtonVisible && !isShowMoreLocked) {
      setShowMoreLocked(true);
      getTaskPage({
        taskListId,
        status,
        filterBy,
        sortBy: 'TASK_DESCRIPTION',
        queryStartPosition: taskListShowMoreIndex * TASK_LIST_SHOW_MORE_STEP,
        search,
        isInbox,
        isAssignedByMeList: listName === 'assigned_by_me',
        isAssignedToMeList: listName === 'assigned_to_me',
      })(dispatch)
        .then(() => {
          setTaskListShowMoreIndex(taskListShowMoreIndex + 1);
          setShowMoreLocked(false);
        })
        .catch(() => {
          setShowMoreLocked(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showMoreButtonVisible, isShowMoreLocked, taskListShowMoreIndex]);

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

  const sortedTasksToShow = [
    ...newlyAddedTasks,
    ...sortWith(reverse(sortingMethods), tasksToShow),
  ];

  return (
    <TaskListOuterContainer>
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
      <ShowMoreButtonContainer active={showMoreButtonVisible}>
        <ShowMoreButton
          onClick={incrementTaskListShowMoreIndex}
          active={showMoreButtonVisible}
        >
          {isShowMoreLocked ? (
            <CubesLoader size={24} color="#fff" />
          ) : (
            'Show more'
          )}
        </ShowMoreButton>
      </ShowMoreButtonContainer>
    </TaskListOuterContainer>
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
