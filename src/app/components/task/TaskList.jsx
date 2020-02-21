import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import { useToggle } from 'react-use';
import { isEmpty, partition } from 'ramda';
import Button from '@material-ui/core/Button';
import CubesLoader from '../common/CubesLoader';
import NewTaskDrawer from '../taskView/NewTaskDrawer';
import Task from './Task';
import Heading from './TaskList.Heading';
import initializeTaskListHooks from './TaskList.Hooks';
import NewTaskElement from './TaskList.NewTaskElement';
import {
  EmptyListElementContainer,
  ShowMoreButton,
  ShowMoreButtonContainer,
  StyledTableCell,
  TaskListOuterContainer,
} from './TaskList.styled';

const ListEmptyElement = ({ addingNewTask, taskDrawerOpen }) => {
  if (addingNewTask) {
    return null;
  }

  return (
    <EmptyListElementContainer taskDrawerOpen={taskDrawerOpen}>
      List is empty.
    </EmptyListElementContainer>
  );
};

const renderTask = ({ taskDrawerOpen, otherTaskListProps }) => task => (
  <Task
    {...{
      task,
      isSubtask: task.parentTaskIdentifier !== null,
      taskDrawerOpen,
      key: task.taskIdentifier,
      ...otherTaskListProps,
    }}
  />
);

const renderTasks = ({
  isMultiList,
  sortedTasksToShow,
  taskDrawerOpen,
  otherTaskListProps,
  areCompleteTasksShown,
  toggleCompletedTasksShown,
}) => {
  const renderTaskBound = renderTask({ taskDrawerOpen, otherTaskListProps });

  if (isMultiList) {
    const [incompleteTasks, completeTasks] = partition(
      ({ status }) => status === 'INCOMPLETE',
      sortedTasksToShow,
    );

    return (
      <Grid container spacing={8}>
        <Grid item xs={12}>
          {incompleteTasks.map(renderTaskBound)}
        </Grid>
        {!isEmpty(completeTasks) && (
          <>
            <Grid item xs={12} container justify="center">
              <Button
                type="button"
                onClick={toggleCompletedTasksShown}
                color="primary"
                variant="contained"
              >
                {`${
                  areCompleteTasksShown ? 'Hide' : 'Show'
                } completed tasks (${completeTasks?.length ?? 0})`}
              </Button>
            </Grid>
            {areCompleteTasksShown && (
              <Grid item xs={12}>
                {completeTasks.map(renderTaskBound)}
              </Grid>
            )}
          </>
        )}
      </Grid>
    );
  }

  return sortedTasksToShow.map(renderTaskBound);
};

const TaskList = ({
  tasks = [],
  taskDrawerOpen,
  taskListIdentifier,
  status,
  search,
  filterBy,
  isInbox,
  listName,
  showListHeadings,
  isMultiList,
  taskDrawerProps = {},
  ...otherTaskListProps
}) => {
  const {
    addingNewTask,
    showMoreButtonVisible,
    incrementTaskListShowMoreIndex,
    onSortingChanged,
    sortedTasksToShow,
    currentSorting,
    isShowMoreLocked,
    addingNewSubtask,
    addingNewSubtaskParentId,
  } = initializeTaskListHooks({
    otherTaskListProps,
    tasks,
    taskListIdentifier,
    isInbox,
    status,
    filterBy,
    search,
    listName,
  });

  const [areCompleteTasksShown, toggleCompletedTasksShown] = useToggle(true);

  const { selectedTaskId, listTasks } = otherTaskListProps || {};

  const otherTaskListSubtasks = (listTasks ?? []).flatMap(
    ({ subtasks }) => subtasks,
  );

  const otherTaskListSubtasksIdentifiers = otherTaskListSubtasks.map(
    ({ taskIdentifier }) => taskIdentifier,
  );

  const otherTaskListSubtasksParentIdentifiers = otherTaskListSubtasks.map(
    ({ parentTaskIdentifier }) => parentTaskIdentifier,
  );

  const otherTaskListIdentifiers = (listTasks ?? []).map(
    ({ taskIdentifier }) => taskIdentifier,
  );

  const isCurrentListSelected =
    (isMultiList &&
      Boolean(otherTaskListSubtasksIdentifiers.includes(selectedTaskId))) ||
    otherTaskListIdentifiers.includes(selectedTaskId) ||
    (addingNewSubtask &&
      otherTaskListSubtasksParentIdentifiers.includes(
        addingNewSubtaskParentId,
      ));

  return (
    <Grid container direction="row" wrap="nowrap">
      <TaskListOuterContainer>
        {showListHeadings && (
          <Heading
            taskDrawerOpen={taskDrawerOpen}
            onSortingChanged={onSortingChanged}
            sorting={currentSorting}
          />
        )}
        <NewTaskElement addingNewTask={addingNewTask} />
        {tasks.length === 0 ? (
          <ListEmptyElement
            addingNewTask={addingNewTask}
            taskDrawerOpen={taskDrawerOpen}
          />
        ) : (
          renderTasks({
            taskDrawerOpen,
            isMultiList,
            sortedTasksToShow,
            otherTaskListProps,
            areCompleteTasksShown,
            toggleCompletedTasksShown,
          })
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
      {taskDrawerOpen && isCurrentListSelected && (
        <NewTaskDrawer
          isInbox={isInbox}
          isMultiList
          compact
          {...taskDrawerProps}
        />
      )}
    </Grid>
  );
};

TaskList.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      taskIdentifier: PropTypes.string,
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
