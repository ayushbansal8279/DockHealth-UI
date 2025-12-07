import React, { useCallback, useRef } from 'react';
import { Grid } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { getTaskListForUser } from 'api/task-list-api';

import { openModal } from 'modal/actions';
import { applyTemplate } from 'actions/template-bundle-actions';

import TaskTemplateApplicator from 'components/task-template/TaskTemplateApplicator/TaskTemplateApplicator';
import QuickAddTaskInput from 'components/tasklist/QuickAddTaskInput/QuickAddTaskInput';
import { TasksToolbarContainer, TaskToolbarAddTask } from './styled';

const TasksToolbar = (props) => {
  const {
    taskListIdentifier,
    taskGroupIdentifier,
    onQuickAddTask,
    iconColorActive,
  } = props;
  const quickAddTaskInputReference = useRef(null);
  const dispatch = useDispatch();
  const { profileIdentifier } = useParams();

  const handleApplyTemplate = useCallback(
    ({ identifier }) => {
      if (taskListIdentifier) {
        dispatch(
          applyTemplate({
            taskTemplateIdentifier: identifier,
            taskListIdentifier,
            taskGroupIdentifier,
            profileIdentifier,
          }),
        );
      } else {
        dispatch(
          openModal('ListPicker', {
            enableSelectingGroupStep: true,
            fetchMethod: getTaskListForUser,
            confirm: (listId, taskGroupId) =>
              dispatch(
                applyTemplate({
                  taskTemplateIdentifier: identifier,
                  taskListIdentifier: listId,
                  profileIdentifier,
                  taskGroupIdentifier: taskGroupId,
                }),
              ),
          }),
        );
      }
    },
    [dispatch, taskGroupIdentifier, taskListIdentifier, profileIdentifier],
  );

  return (
    <TasksToolbarContainer>
      <TaskToolbarAddTask>
        <QuickAddTaskInput
          ref={quickAddTaskInputReference}
          taskListIdentifier={taskListIdentifier}
          quickAddTask={(task) => {
            onQuickAddTask({
              ...task,
              taskListIdentifier,
              taskGroupIdentifier,
            });
            setTimeout(() => {
              quickAddTaskInputReference?.current?.focus();
            }, 0);
          }}
          iconColorActive={iconColorActive}
        />
      </TaskToolbarAddTask>
      <TaskTemplateApplicator
        onTemplateSelect={handleApplyTemplate}
        iconColorActive={iconColorActive}
      />
    </TasksToolbarContainer>
  );
};

export default TasksToolbar;
