/* eslint-disable react-hooks/rules-of-hooks */
import { useCallback, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectedTaskSelector } from 'selectors/task-drawer-selectors';
import palette from 'styles/palette';
import { toggleTaskPriority } from 'actions/task-actions';
import * as AlertActions from 'alert/actions';
import AlertMessages from 'alert/AlertMessages';

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

const initializePrioritySectionHooks = ({
  onTaskUpdate,
  formMethods: { watch, setValue, clearError },
}) => {
  const currentValue = watch('priority');
  const dispatch = useDispatch();
  const selectedTask = useSelector(selectedTaskSelector);
  const selectedTaskIdentifier = selectedTask?.taskIdentifier;
  useLayoutEffect(() => {
    clearError();
    setValue('priority', selectedTask?.priority ?? null);
  }, [clearError, selectedTask, setValue]);
  const setAutoSaveVisible = useCallback(() => {
    dispatch(AlertActions.showSideBarAlert(AlertMessages.SAVED));
  }, [dispatch]);

  const saveTaskPriority = useCallback(
    ({ newTaskPriority }) => {
      if (selectedTask && selectedTask.taskIdentifier != null) {
        toggleTaskPriority(
          selectedTask,
          newTaskPriority,
        )(dispatch)
          .then(updatedTask => {
            onTaskUpdate(updatedTask);
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
  };
};

export default initializePrioritySectionHooks;
