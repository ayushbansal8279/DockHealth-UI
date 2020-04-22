import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';
import palette from 'app/palette';
import CubesLoader from '../common/CubesLoader';
import TaskDrawer from '../taskView/TaskDrawer';
import Heading from './TaskList.Heading';
import initializeTaskListHooks from './TaskList.Hooks';
import NewTaskElement from './TaskList.NewTaskElement';
import { ListEmptyElement, renderTasks } from './TaskList.RenderTasks';
import {
  ShowMoreButton,
  ShowMoreButtonContainer,
  StyledTableCell,
  TaskListOuterContainer,
} from './TaskList.styled';

const useTaskListClasses = makeStyles({
  paneled: {
    padding: '0 0.75rem 0.75rem',
  },
});

const TaskList = ({
  tasks = [],
  taskDrawerOpen,
  taskListIdentifier,
  status,
  search,
  filterBy,
  sortBy = '',
  onCompletedTasksRequest,
  isInbox,
  listName,
  showListHeadings,
  completedListTaskCount,
  isMultiList,
  taskDrawerProps = {},
  paneled = false,
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
    listTasks,
    areCompleteTasksShown,
    toggleCompletedTasksShown,
    globalSearch,
    getCompletedTasks,
    isCurrentListSelected,
  } = initializeTaskListHooks({
    otherTaskListProps,
    tasks,
    taskListIdentifier,
    isInbox,
    status,
    filterBy,
    sortBy,
    search,
    listName,
    isMultiList,
    taskDrawerProps,
    onCompletedTasksRequest,
  });

  const taskListClasses = useTaskListClasses();

  return (
    <Grid
      container
      direction="row"
      wrap="nowrap"
      className={clsx(paneled && taskListClasses.paneled)}
    >
      <TaskListOuterContainer>
        {showListHeadings && (
          <Heading
            taskDrawerOpen={taskDrawerOpen}
            onSortingChanged={onSortingChanged}
            sorting={currentSorting}
          />
        )}
        <NewTaskElement addingNewTask={addingNewTask} />
        {(listTasks ?? tasks ?? []).length === 0 ? (
          <ListEmptyElement
            addingNewTask={addingNewTask}
            taskDrawerOpen={taskDrawerOpen}
          />
        ) : (
          renderTasks({
            taskDrawerOpen,
            completedListTaskCount,
            isMultiList,
            sortedTasksToShow,
            otherTaskListProps,
            areCompleteTasksShown,
            toggleCompletedTasksShown,
            globalSearch,
            getCompletedTasks,
            paneled,
          })
        )}
        <ShowMoreButtonContainer active={showMoreButtonVisible}>
          <ShowMoreButton
            onClick={incrementTaskListShowMoreIndex}
            active={showMoreButtonVisible}
          >
            {isShowMoreLocked ? (
              <CubesLoader size={24} color={palette.white} />
            ) : (
              'Show more'
            )}
          </ShowMoreButton>
        </ShowMoreButtonContainer>
      </TaskListOuterContainer>
      {taskDrawerOpen && isMultiList && isCurrentListSelected && (
        <TaskDrawer
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
