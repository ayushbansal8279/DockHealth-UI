/* eslint-disable react-hooks/rules-of-hooks */
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormContext } from 'react-hook-form';

import palette from 'styles/palette';
import { updateWorkflowStatus } from 'actions/task-actions';

export const STATUSES = [
  {
    value: 'NO_STATUS',
    label: 'No status',
    color: 'transparent',
  },
  {
    value: 'PLANNED',
    label: 'Planned',
    color: palette.brightBlue,
  },
  {
    value: 'IN_PROGRESS',
    label: 'In progress',
    color: palette.keyLimePie,
  },
  {
    value: 'WAITING',
    label: 'Waiting',
    color: palette.coolGrey2,
  },
  {
    value: 'ON_HOLD',
    label: 'On hold',
    color: palette.mediumGrey,
  },
];

const initializeStatusSectionHooks = ({ setAutoSaveVisible }) => {
  const { watch } = useFormContext();
  const currentValue = watch('workflowStatus');
  const dispatch = useDispatch();

  const { selectedTask } = useSelector(store => ({
    selectedTask: store.taskState.selectedTask,
  }));
  const selectedTaskIdentifier = selectedTask?.taskIdentifier;

  const saveTaskStatus = useCallback(
    ({ newTaskStatus }) => {
      if (selectedTask && selectedTask.taskIdentifier != null) {
        updateWorkflowStatus(
          selectedTask,
          newTaskStatus,
        )(dispatch)
          .then(() => {
            setAutoSaveVisible();
          })
          .catch(() => {
            toggleAlert(
              'Error updating status, please try again later',
              'error',
            );
          });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedTaskIdentifier],
  );

  return {
    currentStatusFlagColor: STATUSES.find(({ value }) => value === currentValue)
      ?.color,
    saveTaskStatus,
  };
};

export default initializeStatusSectionHooks;
