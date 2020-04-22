import { Button, Collapse, Grid } from '@material-ui/core';
import { isEmpty, partition } from 'ramda';
import React, { useCallback } from 'react';
import useBoolean from 'hooks/useBoolean';
import palette from 'app/palette';
import CubesLoader from '../common/CubesLoader';
import Spacing from '../common/Spacing';
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

const getCompletedTasksLabel = ({
  isFetching,
  areCompleteTasksShown,
  hasFetched,
  completeTasksCount,
}) => {
  if (isFetching) {
    return (
      <>
        <Spacing horizontal={3} />
        <CubesLoader color={palette.white} size={24} />
      </>
    );
  }

  if (
    areCompleteTasksShown &&
    hasFetched &&
    !isFetching &&
    completeTasksCount === 0
  ) {
    return 'No completed tasks';
  }

  const buttonPrefixLabel = `${
    areCompleteTasksShown ? 'Hide' : 'Show'
  } completed tasks`;

  return (
    <>
      {buttonPrefixLabel}
      {completeTasksCount > 0 ? ` (${completeTasksCount})` : ''}
    </>
  );
};

export const renderTasks = ({
  completedListTaskCount,
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
    /* eslint-disable react-hooks/rules-of-hooks */
    const [isFetching, setFetching, unsetFetching] = useBoolean(false);
    const [hasFetched, setHasFetched] = useBoolean(false);

    const onFetchingCompleted = useCallback(() => {
      unsetFetching();
      setHasFetched();
    }, [setHasFetched, unsetFetching]);
    /* eslint-enable react-hooks/rules-of-hooks */

    const [incompleteTasks, completeTasks] = partition(
      ({ status }) => status === 'INCOMPLETE',
      sortedTasksToShow,
    );

    const completeTasksCountFromTasks = [
      ...completeTasks,
      ...completeTasks.flatMap(task => task?.subtasks ?? null).filter(Boolean),
    ].length;

    const completeTasksCount =
      completeTasksCountFromTasks > 0
        ? completeTasksCountFromTasks
        : completedListTaskCount;

    const completedTasksLabel = getCompletedTasksLabel({
      isFetching,
      areCompleteTasksShown,
      hasFetched,
      completeTasksCount,
    });

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
            {completeTasksCount > 0 && (
              <Button
                size="small"
                type="button"
                onClick={
                  areCompleteTasksShown
                    ? toggleCompletedTasksShown
                    : () => {
                        setFetching();
                        getCompletedTasks()
                          .then(onFetchingCompleted)
                          .catch(onFetchingCompleted);
                      }
                }
                variant="contained"
              >
                {completedTasksLabel}
              </Button>
            )}
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
