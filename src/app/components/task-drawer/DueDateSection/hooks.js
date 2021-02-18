/* eslint-disable react-hooks/rules-of-hooks */
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateDueDate } from 'actions/task-actions';
import moment from 'moment';
import * as AlertActions from 'alert/actions';

const initializeDueDateSectionHooks = ({
  setAutoSaveVisible,
  setValue,
  onTaskUpdate,
}) => {
  const dispatch = useDispatch();

  const selectedTask = useSelector(store => store.taskState.selectedTask);
  const selectedTaskIdentifier = selectedTask?.taskIdentifier;

  const saveDueDate = useCallback(
    async ({ updatedDueDate, updatedDueTime }) => {
      let updatedDueTimeValue = updatedDueTime;
      if (updatedDueTimeValue === '__:__ __') {
        updatedDueTimeValue = '';
      }

      if (selectedTask && selectedTask.taskIdentifier != null) {
        const dueDate = updatedDueDate
          ? moment(`${updatedDueDate}`, 'YYYYY-MM-DD')
          : null;

        const dueDateTime =
          updatedDueDate && updatedDueTimeValue
            ? moment(
                `${updatedDueDate} ${updatedDueTimeValue}`,
                'YYYY-MM-DD HH:mm',
              )
            : dueDate;

        return updateDueDate(
          selectedTask,
          dueDateTime,
          false,
        )(dispatch)
          .then(task => {
            setAutoSaveVisible();
            onTaskUpdate(task);
            return task;
          })
          .catch(() => {
            dispatch(
              AlertActions.showGlobalErrorAlert(
                'Error updating due date, please try again later',
              ),
            );
          });
      }
      return Promise.reject();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedTaskIdentifier, selectedTask, onTaskUpdate],
  );

  const clearDueDate = async event => {
    event.stopPropagation();
    setValue('dueDate', null);
    if (selectedTask && selectedTask.taskIdentifier != null) {
      try {
        const task = await updateDueDate(selectedTask, null, false)(dispatch);
        onTaskUpdate(task);
        setAutoSaveVisible();
      } catch {
        dispatch(
          AlertActions.showGlobalErrorAlert(
            'Error updating due date, please try again later',
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
