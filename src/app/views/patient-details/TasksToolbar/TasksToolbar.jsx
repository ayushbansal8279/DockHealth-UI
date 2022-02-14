import React, { useCallback, useRef } from 'react';
import { Grid } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { getTaskListForUser } from 'api/task-list-api';

import { openModal } from 'modal/actions';
import { applyTemplate } from 'actions/template-bundle-actions';

import TaskTemplateApplicator from 'components/task-template/TaskTemplateApplicator/TaskTemplateApplicator';
import QuickAddTaskInput from 'components/tasklist/QuickAddTaskInput/QuickAddTaskInput';

const TasksToolbar = props => {
  const { taskListIdentifier, taskGroupIdentifier, onQuickAddTask } = props;
  const quickAddTaskInputReference = useRef(null);
  const dispatch = useDispatch();
  const { patientIdentifier } = useParams();

  const handleApplyTemplate = useCallback(
    ({ identifier }) => {
      if (taskListIdentifier) {
        dispatch(
          applyTemplate({
            taskTemplateIdentifier: identifier,
            taskListIdentifier,
            taskGroupIdentifier,
            patientIdentifier,
          }),
        );
      } else {
        dispatch(
          openModal('ListPicker', {
            fetchMethod: getTaskListForUser,
            confirm: listId =>
              dispatch(
                applyTemplate({
                  taskTemplateIdentifier: identifier,
                  taskListIdentifier: listId,
                  patientIdentifier,
                }),
              ),
          }),
        );
      }
    },
    [dispatch, taskGroupIdentifier, taskListIdentifier, patientIdentifier],
  );

  return (
    <Grid container direction="row">
      <Grid item xs>
        <QuickAddTaskInput
          ref={quickAddTaskInputReference}
          taskListIdentifier={taskListIdentifier}
          quickAddTask={task => {
            onQuickAddTask({
              ...task,
              taskListIdentifier,
              taskGroupIdentifier,
            });
            setTimeout(() => {
              quickAddTaskInputReference.current.focus();
            }, 0);
          }}
        />
      </Grid>
      <TaskTemplateApplicator onTemplateSelect={handleApplyTemplate} />
    </Grid>
  );
};

export default TasksToolbar;
