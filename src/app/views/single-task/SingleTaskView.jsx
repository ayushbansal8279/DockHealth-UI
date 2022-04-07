import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ViewLayout from 'components/template/ViewLayout/ViewLayout';
import {
  refreshAndOpenAsCurrentTask,
  storeAsCurrentTask,
} from 'actions/task-actions';
import TaskContent from 'components/task-drawer/TaskDrawerContent/TaskDrawerContent';
import { Box } from '@material-ui/core';
import { useParams, useHistory } from 'react-router-dom';
import {
  selectedTaskSelector,
  taskDrawerSelector,
} from 'selectors/task-drawer-selectors';
import { HOME_PATH } from 'routing/helpers/paths';
import { isEmpty } from 'ramda';
import { TaskViewContainer } from './styled';
import SingleTaskHeader from './SingleTaskHeader/SingleTaskHeader';
import SingleTaskSkeleton from './SingleTaskSkeleton';

const SingleTaskView = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { identifier } = useParams();
  const selectedTask = useSelector(selectedTaskSelector) || {};
  const { error } = useSelector(taskDrawerSelector) || {};
  const isFetching = isEmpty(selectedTask);

  const goToDashboard = useCallback(() => {
    history.push(HOME_PATH);
  }, [history]);

  const setTask = useCallback(() => {
    dispatch(
      refreshAndOpenAsCurrentTask({ taskIdentifier: identifier }, false),
    );
  }, [dispatch, identifier]);

  useEffect(() => {
    setTask();
    return () => {
      storeAsCurrentTask(null);
    };
  }, [setTask, identifier]);

  useEffect(() => {
    if (error) {
      storeAsCurrentTask(null);
      goToDashboard();
    }
  }, [error, goToDashboard]);

  return (
    <ViewLayout header={<SingleTaskHeader />}>
      <TaskViewContainer>
        {!error && (
          <Box maxWidth="800px" m="36px 0" height="100%">
            {isFetching ? (
              <SingleTaskSkeleton />
            ) : (
              <TaskContent
                onTaskCreation={goToDashboard}
                onTaskDelete={goToDashboard}
              />
            )}
          </Box>
        )}
      </TaskViewContainer>
    </ViewLayout>
  );
};

export default SingleTaskView;
