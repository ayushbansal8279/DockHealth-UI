import PropTypes from 'prop-types';
import React from 'react';

import CubesLoader from '../common/CubesLoader';
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

  return (
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
        sortedTasksToShow.map(task => (
          <Task
            {...{
              task,
              isSubtask: task.parentTaskIdentifier !== null,
              taskDrawerOpen,
              key: task.taskIdentifier,
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
