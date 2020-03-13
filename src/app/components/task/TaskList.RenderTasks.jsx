import { Collapse } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { isEmpty, partition } from 'ramda';
import React from 'react';
import Task from './Task';
import { EmptyListElementContainer } from './TaskList.styled';

export const ListEmptyElement = ({
  addingNewTask,
  taskDrawerOpen,
  globalSearch,
  label = 'List is empty.',
}) => {
  if (addingNewTask || globalSearch) {
    return null;
  }

  return (
    <EmptyListElementContainer taskDrawerOpen={taskDrawerOpen}>
      {label}
    </EmptyListElementContainer>
  );
};

export const renderTask = ({
  taskDrawerOpen,
  otherTaskListProps,
  paneled,
}) => task => (
  <Task
    {...{
      task,
      isSubtask: task.parentTaskIdentifier !== null,
      taskDrawerOpen,
      paneled,
      key: task.taskIdentifier,
      ...otherTaskListProps,
    }}
  />
);

export const renderTasks = ({
  isMultiList,
  sortedTasksToShow,
  taskDrawerOpen,
  otherTaskListProps,
  areCompleteTasksShown,
  toggleCompletedTasksShown,
  getCompletedTasks,
  globalSearch,
  paneled,
}) => {
  const renderTaskBound = renderTask({
    taskDrawerOpen,
    otherTaskListProps,
    paneled,
  });

  if (isMultiList) {
    const [incompleteTasks, completeTasks] = partition(
      ({ status }) => status === 'INCOMPLETE',
      sortedTasksToShow,
    );

    const completeTasksCount = [
      ...completeTasks,
      ...completeTasks.flatMap(task => task?.subtasks ?? null).filter(Boolean),
    ].length;

    return (
      <Grid container spacing={1}>
        <Grid item xs={12}>
          {isEmpty(incompleteTasks) ? (
            <ListEmptyElement
              label="No incomplete tasks remaining."
              globalSearch={globalSearch}
            />
          ) : (
            incompleteTasks.map(renderTaskBound)
          )}
        </Grid>
        {!globalSearch && (
          <Grid item xs={12} container justify="center">
            <Button
              size="small"
              type="button"
              onClick={
                areCompleteTasksShown
                  ? toggleCompletedTasksShown
                  : getCompletedTasks
              }
              variant="contained"
            >
              {`${areCompleteTasksShown ? 'Hide' : 'Show'} completed tasks${
                completeTasksCount > 0 ? ` (${completeTasksCount})` : ''
              }`}
            </Button>
          </Grid>
        )}
        <Collapse in={areCompleteTasksShown || globalSearch}>
          <Grid item xs={12}>
            {completeTasks.map(renderTaskBound)}
          </Grid>
        </Collapse>
      </Grid>
    );
  }

  return sortedTasksToShow.map(renderTaskBound);
};
