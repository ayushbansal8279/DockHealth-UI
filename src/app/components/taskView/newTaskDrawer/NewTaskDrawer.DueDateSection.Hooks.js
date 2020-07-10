/* eslint-disable react-hooks/rules-of-hooks */
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateDueDate } from 'actions/task-actions';
import moment from 'moment';
import * as AlertActions from 'alert/actions';

const initializeDueDateSectionHooks = ({
  setAutoSaveVisible,
  setValue,
  refreshList,
  shouldRefresh,
}) => {
  const dispatch = useDispatch();

  const selectedTask = useSelector(store => store.taskState.selectedTask);
  const selectedTaskIdentifier = selectedTask?.taskIdentifier;

  const saveDueDate = useCallback(
    ({ updatedDueDate, updatedDueTime }) => {
      let updatedDueTimeValue = updatedDueTime;
      if (updatedDueTimeValue === '__:__ __') {
        updatedDueTimeValue = '';
      }
      if (selectedTask && selectedTask.taskIdentifier != null) {
        const dueDate = updatedDueDate ? moment(`${updatedDueDate}`) : null;

        const dueDateTime =
          updatedDueDate && updatedDueTimeValue
            ? moment(`${updatedDueDate} ${updatedDueTimeValue}`)
            : dueDate;
        updateDueDate(
          selectedTask,
          dueDateTime,
          false,
        )(dispatch)
          .then(() => {
            setAutoSaveVisible();
            if (shouldRefresh) {
              refreshList();
            }
          })
          .catch(() => {
            dispatch(
              AlertActions.showGlobalAlert(
                'Error updating due date, please try again later',
                'error',
              ),
            );
          });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedTaskIdentifier, refreshList],
  );

  const clearDueDate = async event => {
    event.stopPropagation();
    setValue('dueDate', null);
    if (selectedTask && selectedTask.taskIdentifier != null) {
      try {
        await updateDueDate(selectedTask, null, false)(dispatch);
        if (shouldRefresh) refreshList();
        setAutoSaveVisible();
      } catch {
        dispatch(
          AlertActions.showGlobalAlert(
            'Error updating due date, please try again later',
            'error',
          ),
        );
      }
    }
  };

  return {
    saveDueDate,
    clearDueDate,
  };
};

export default initializeDueDateSectionHooks;
