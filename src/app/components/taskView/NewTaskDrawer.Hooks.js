import head from 'ramda/es/head';
import { useCallback, useEffect, useRef, useState } from 'react';
import useForm from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { getAllPatients } from '../../actions/patient-actions';
import {
  storeAsCurrentTask as storeAsCurrentTaskAction,
  toggleTaskPriority,
} from '../../actions/task-actions';
import useBoolean from '../../hooks/useBoolean';
import { taskValidationSchema } from './NewTaskDrawer.validationSchema';

export default ({ headsUpAreaRef, statusSelectData }) => {
  // STATE HOOKS

  const [
    priorityActive,
    setPriorityActive,
    unsetPriorityActive,
    togglePriorityActive,
  ] = useBoolean(false);
  const [statusPopoverOpen, openStatusPopover, closeStatusPopover] = useBoolean(
    false,
  );
  const [status, setStatus] = useState(head(statusSelectData));
  const [headsUpAreaHeight, setHeadsUpAreaHeight] = useState(0);
  const [deferredCommentsPromises, setDeferredCommentsPromises] = useState([]);
  const [
    autoSaveVisible,
    setAutoSaveVisible,
    unsetAutoSaveVisible,
  ] = useBoolean(false);
  const [autoSaveTimeoutId, setAutoSaveTimeoutId] = useState(null);
  const formMethods = useForm({
    validationSchema: taskValidationSchema,
  });

  // REF HOKS

  const taskContainerReference = useRef(null);

  // SELECTORS

  const userProfile = useSelector(store => store.userState.userProfile);

  const { task, parentTask, subtaskOrder } = useSelector(({ taskState }) => {
    const tasks = [...taskState.tasks, ...taskState.completedTasks];
    const { selectedTask } = taskState;

    const isSubtask = Boolean(selectedTask?.parentTaskId);
    const taskId = selectedTask?.taskId;

    if (!isSubtask) {
      return {
        parentTask: null,
        subtaskOrder: null,
        task: selectedTask,
      };
    }

    const foundParentTask = tasks.find(
      ({ taskId: storeTaskId }) => selectedTask.parentTaskId === storeTaskId,
    );
    const foundSubtaskOrder = foundParentTask?.subtasks.findIndex(
      ({ taskId: subtaskId }) => subtaskId === taskId,
    );

    return {
      task: selectedTask,
      parentTask: foundParentTask,
      subtaskOrder: foundSubtaskOrder >= 0 ? foundSubtaskOrder + 1 : 0,
    };
  });

  // #region CALLBACKS

  const dispatch = useDispatch();
  const taskId = task?.taskId;
  const taskWorkflowStatus = task?.workflowStatus;
  const taskPriority = task?.priority;
  const userId = userProfile?.userId;

  const storeAsCurrentTask = useCallback(
    newTask => storeAsCurrentTaskAction(newTask)(dispatch),
    [dispatch],
  );

  const saveTaskPriority = useCallback(
    ({ newTaskPriority }) => {
      toggleTaskPriority(task, parseInt(userId, 10) || -1, newTaskPriority)(
        dispatch,
      )
        .then(() => {
          setAutoSaveVisible();
        })
        .catch(() => {
          toggleAlert(
            'Error updating priority, please try again later',
            'error',
          );
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [taskId, userId],
  );

  const addDeferredCommentToQueue = useCallback(
    ({ promise, clearMethod }) => {
      if (deferredCommentsPromises.length === 0) {
        setDeferredCommentsPromises([clearMethod, promise]);
      } else {
        setDeferredCommentsPromises([...deferredCommentsPromises, promise]);
      }
    },
    [deferredCommentsPromises],
  );

  const clearAutoSaveTimeout = useCallback(() => {
    clearTimeout(autoSaveTimeoutId);
    setAutoSaveTimeoutId(null);
    unsetAutoSaveVisible();
  }, [autoSaveTimeoutId, unsetAutoSaveVisible]);

  // #endregion

  // #region EFFECTS

  useEffect(() => {
    getAllPatients()(dispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (autoSaveVisible) {
      clearTimeout(autoSaveTimeoutId);
      setAutoSaveTimeoutId(
        setTimeout(() => {
          clearAutoSaveTimeout();
        }, 1000),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSaveVisible]);

  useEffect(() => {
    const isPriorityHigh = taskPriority === 'HIGH';

    if (isPriorityHigh) {
      setPriorityActive();
    } else {
      unsetPriorityActive();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskPriority, taskId]);

  useEffect(() => {
    const newWorkflowStatus =
      statusSelectData.find(({ value }) => value === taskWorkflowStatus) ??
      head(statusSelectData);

    setStatus(newWorkflowStatus);
  }, [taskWorkflowStatus, taskId, statusSelectData]);

  useEffect(
    () => {
      setHeadsUpAreaHeight(headsUpAreaRef?.scrollHeight ?? 0);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [headsUpAreaRef?.scrollHeight],
  );

  useEffect(() => {
    setDeferredCommentsPromises([]);
    clearAutoSaveTimeout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  // #endregion

  return {
    addDeferredCommentToQueue,
    autoSaveTimeoutId,
    autoSaveVisible,
    closeStatusPopover,
    deferredCommentsPromises,
    dispatch,
    formMethods,
    headsUpAreaHeight,
    openStatusPopover,
    parentTask,
    priorityActive,
    saveTaskPriority,
    setAutoSaveTimeoutId,
    setAutoSaveVisible,
    setDeferredCommentsPromises,
    setHeadsUpAreaHeight,
    setPriorityActive,
    setStatus,
    status,
    statusPopoverOpen,
    storeAsCurrentTask,
    subtaskOrder,
    task,
    taskId,
    taskContainerReference,
    togglePriorityActive,
    unsetAutoSaveVisible,
    unsetPriorityActive,
    userProfile,
  };
};
