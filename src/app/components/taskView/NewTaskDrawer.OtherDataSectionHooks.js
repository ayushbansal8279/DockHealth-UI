import moment from 'moment';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useMount } from 'react-use';
import {
  getTaskHistory,
  moveTask,
  storeAsCurrentTask,
  updateDueDate,
} from '../../actions/task-actions';
import useBoolean from '../../hooks/useBoolean';

export default ({ task, setAutoSaveVisible, closeDrawer }) => {
  const taskLists = useSelector(store => store.taskListState.tasklist) || [];
  const currentUser = useSelector(store => store.userState.userProfile);
  const todaysMoment = moment().format('MMM D, YYYY @ h:mma');

  const { register, setValue } = useFormContext();
  const dispatch = useDispatch();

  const [newTaskListName, setNewTaskListName] = useState('');
  const [newDueDate, setNewDueDate] = useState(task?.dueDate ?? null);

  const [
    isTaskListPopoverOpen,
    setTaskListPopoverOpen,
    unsetTaskListPopoverOpen,
  ] = useBoolean(false);
  const [isHistoryShown, , hideHistory, toggleHistory] = useBoolean(false);
  const [isHistoryLoading, setHistoryLoading, unsetHistoryLoading] = useBoolean(
    false,
  );
  const [history, setHistory] = useState([]);
  const taskListButtonReference = useRef(null);

  const newDueDateMoment = moment(newDueDate);
  const taskId = task?.taskId;

  useMount(() => {
    setValue('newTaskListId', null);
    setValue('newTaskDueDate', null);
    setNewTaskListName('');
    setHistory([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  useEffect(() => {
    setValue(
      'newTaskDueDate',
      newDueDateMoment
        .set({ hour: 0, minute: 0, second: 0 })
        .format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newDueDate]);

  useEffect(() => {
    if (isHistoryShown) {
      if (task) {
        getTaskHistory(task)(dispatch)
          .then(historyDetails => {
            setHistory(historyDetails);
            unsetHistoryLoading();
          })
          .catch(() => {
            unsetHistoryLoading();
          });
      }
    } else {
      setHistory([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHistoryShown]);

  useEffect(() => {
    setHistory([]);
    setNewDueDate(task?.dueDate ? moment(task.dueDate).toDate() : null);
    hideHistory();
    unsetHistoryLoading();
    unsetTaskListPopoverOpen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  const onToggleHistoryButtonClicked = useCallback(() => {
    if (!isHistoryShown) {
      setHistoryLoading();
    }
    toggleHistory();
  }, [setHistoryLoading, isHistoryShown, toggleHistory]);

  const saveDueDate = useCallback(
    ({ updatedDueDate }) => {
      updateDueDate(task, updatedDueDate ? moment(updatedDueDate) : null)(
        dispatch,
      )
        .then(() => {
          setAutoSaveVisible();
        })
        .catch(() => {
          toggleAlert(
            'Error updating due date, please try again later',
            'error',
          );
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [taskId],
  );

  const saveTaskList = useCallback(
    ({ newTaskList }) => {
      moveTask(task, newTaskList)(dispatch)
        .then(() => {
          toggleAlert(
            `Task moved successfully to list ${newTaskList.listName}`,
            'success',
          );
          storeAsCurrentTask(null)(dispatch);
          closeDrawer();
        })
        .catch(() => {
          toggleAlert(
            `Error moving task to list ${newTaskList.listName}, please try again later`,
            'error',
          );
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [taskId],
  );

  const clearDueDate = useCallback(() => {
    setNewDueDate(null);
    saveDueDate({ updateDueDate: null });
  }, [saveDueDate, setNewDueDate]);

  const userProfileAccess = useSelector(
    state => state.userState.userProfile?.access,
  );

  return {
    taskLists,
    currentUser,
    todaysMoment,
    register,
    setValue,
    newTaskListName,
    setNewTaskListName,
    isTaskListPopoverOpen,
    setTaskListPopoverOpen,
    unsetTaskListPopoverOpen,
    isHistoryShown,
    hideHistory,
    toggleHistory,
    isHistoryLoading,
    setHistoryLoading,
    unsetHistoryLoading,
    history,
    setHistory,
    taskListButtonReference,
    newDueDateMoment,
    clearDueDate,
    saveTaskList,
    saveDueDate,
    onToggleHistoryButtonClicked,
    taskId,
    newDueDate,
    setNewDueDate,
    userProfileAccess,
  };
};
