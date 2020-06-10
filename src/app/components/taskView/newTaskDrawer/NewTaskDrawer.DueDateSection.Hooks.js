/* eslint-disable react-hooks/rules-of-hooks */
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateDueDate } from 'actions/task-actions';
import moment from 'moment';

const initializeDueDateSectionHooks = ({ setAutoSaveVisible }) => {
  const dispatch = useDispatch();

  const { selectedTask } = useSelector(store => ({
    selectedTask: store.taskState.selectedTask,
  }));
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
        )(dispatch)
          .then(() => {
            setAutoSaveVisible();
          })
          .catch(() => {
            toggleAlert(
              'Error updating due date, please try again later',
              'error',
            );
          });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedTaskIdentifier],
  );

  return {
    saveDueDate,
  };
};

export default initializeDueDateSectionHooks;
