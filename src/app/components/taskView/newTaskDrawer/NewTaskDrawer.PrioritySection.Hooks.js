/* eslint-disable react-hooks/rules-of-hooks */
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormContext } from 'react-hook-form';
import palette from 'styles/palette';
import { toggleTaskPriority } from 'actions/task-actions';
import * as AlertActions from 'alert/actions';

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
  const { watch, setValue } = useFormContext();
  const currentValue = watch('priority');
  const dispatch = useDispatch();

  const selectedTask = useSelector(store => store.taskState.selectedTask);
  const selectedTaskIdentifier = selectedTask?.taskIdentifier;

  const saveTaskPriority = useCallback(
    ({ newTaskPriority }) => {
      if (selectedTask && selectedTask.taskIdentifier != null) {
        toggleTaskPriority(
          selectedTask,
          newTaskPriority,
        )(dispatch)
          .then(() => {
            setAutoSaveVisible();
          })
          .catch(() => {
            dispatch(
              AlertActions.showGlobalAlert(
                'Error updating priority, please try again later',
                'error',
              ),
            );
          });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedTaskIdentifier, selectedTask],
  );

  return {
    currentPriorityFlagColor:
      PRIORITIES.find(({ value }) => value === currentValue)?.color ||
      'transparent',
    saveTaskPriority,
    setValue,
  };
};

export default initializePrioritySectionHooks;
