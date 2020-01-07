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
  taskListId,
  status,
  search,
  filterBy,
  isInbox,
  listName,
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
    taskListId,
    isInbox,
    status,
    filterBy,
    search,
    listName,
  });

  return (
    <TaskListOuterContainer>
      <Heading
        taskDrawerOpen={taskDrawerOpen}
        onSortingChanged={onSortingChanged}
        sorting={currentSorting}
      />
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
