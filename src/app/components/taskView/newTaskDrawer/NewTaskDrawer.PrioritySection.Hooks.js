/* eslint-disable react-hooks/rules-of-hooks */
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormContext } from 'react-hook-form';
import palette from 'styles/palette';
import { toggleTaskPriority } from 'actions/task-actions';

export const PRIORITIES = [
  {
    value: 'NONE',
    label: 'No priority',
    color: 'transparent',
  },
  {
    value: 'HIGH',
    label: 'High',
    color: palette.tomatoInYoFace,
  },
];

const initializePrioritySectionHooks = ({ setAutoSaveVisible }) => {
  const { watch } = useFormContext();
  const currentValue = watch('priority');
  const dispatch = useDispatch();

  const { selectedTask, taskContext } = useSelector(store => ({
    selectedTask: store.taskState.selectedTask,
    taskContext: store.taskState.selectedTaskContext,
  }));
  const selectedTaskIdentifier = selectedTask?.taskIdentifier;

  const saveTaskPriority = useCallback(
    ({ newTaskPriority }) => {
      if (selectedTask && selectedTask.taskIdentifier != null) {
        toggleTaskPriority(
          selectedTask,
          newTaskPriority,
          taskContext,
        )(dispatch)
          .then(() => {
            setAutoSaveVisible();
          })
          .catch(() => {
            toggleAlert(
              'Error updating priority, please try again later',
              'error',
            );
          });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedTaskIdentifier],
  );

  return {
    currentPriorityFlagColor: PRIORITIES.find(
      ({ value }) => value === currentValue,
    )?.color,
    saveTaskPriority,
  };
};

export default initializePrioritySectionHooks;
