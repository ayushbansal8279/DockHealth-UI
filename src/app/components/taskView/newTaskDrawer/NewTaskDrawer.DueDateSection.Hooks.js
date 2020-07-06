/* eslint-disable react-hooks/rules-of-hooks */
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateDueDate } from 'actions/task-actions';
import moment from 'moment';
import * as AlertActions from 'alert/actions';

const initializeDueDateSectionHooks = ({ setAutoSaveVisible, setValue }) => {
  const dispatch = useDispatch();

  const selectedTask = useSelector(store => store.taskState.selectedTask);
  const selectedTaskIdentifier = selectedTask?.taskIdentifier;

  const saveDueDate = useCallback(
    ({ updatedDueDate, updatedDueTime }) => {
      if (selectedTask && selectedTask.taskIdentifier != null) {
        const dueDate = updatedDueDate ? moment(`${updatedDueDate}`) : null;

        const dueDateTime =
          updatedDueDate && updatedDueTime
            ? moment(`${updatedDueDate} ${updatedDueTime}`)
            : dueDate;
        updateDueDate(
          selectedTask,
          dueDateTime,
          false,
        )(dispatch)
          .then(() => {
            setAutoSaveVisible();
          })
          .catch(() => {
            dispatch(AlertActions.showGlobalAlert(
              'Error updating due date, please try again later',
              'error',
            ));
          });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedTaskIdentifier],
  );

  const clearDueDate = async event => {
    event.stopPropagation();
    setValue('dueDate', null);
    if (selectedTask && selectedTask.taskIdentifier != null) {
      try {
        await updateDueDate(selectedTask, null, false)(dispatch);
        setAutoSaveVisible();
      } catch {
        dispatch(AlertActions.showGlobalAlert('Error updating due date, please try again later', 'error'));
      }
    }
  };

  return {
    saveDueDate,
    clearDueDate,
  };
};

export default initializeDueDateSectionHooks;
