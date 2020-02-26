import head from 'ramda/es/head';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useMount } from 'react-use';

import { getAllPatients } from '../../actions/patient-actions';
import { getMembersByTaskListId } from '../../actions/tasklist-actions';
import {
  storeAsCurrentTask as storeAsCurrentTaskAction,
  toggleTaskPriority,
} from '../../actions/task-actions';
import useBoolean from '../../hooks/useBoolean';
import { taskValidationSchema } from './NewTaskDrawer.ValidationSchema';

export default ({ headsUpAreaRef, statusSelectData, isMultiList, isInbox }) => {
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
  const [popoversOpen, setPopoversOpen] = useState({});

  // REF HOKS

  const taskContainerReference = useRef(null);

  // SELECTORS

  const userProfile = useSelector(store => store.userState.userProfile);
  const { task, parentTask, subtaskOrder } = useSelector(
    ({ taskState, taskListState, userState }) => {
      const tasks = [...taskState.tasks, ...taskState.completedTasks];
      const { selectedTask } = taskState;

      const isSubtask = Boolean(selectedTask?.parentTaskIdentifier);
      const taskIdentifier = selectedTask?.taskIdentifier;

      const taskListMembers = isInbox
        ? [userState.userProfile]
        : taskListState.tasklistmembers;

      const assignedTo = taskListMembers.find(
        ({ userIdentifier }) =>
          userIdentifier === selectedTask?.assignedTo?.userIdentifier,
      );

      const selectedTaskWithAssignee = {
        ...selectedTask,
        assignedTo:
          selectedTask?.assignedTo || assignedTo
            ? {
                ...(selectedTask?.assignedTo ?? {}),
                ...(assignedTo ?? {}),
              }
            : null,
      };

      if (!isSubtask) {
        return {
          parentTask: null,
          subtaskOrder: null,
          task: selectedTaskWithAssignee,
        };
      }

      const foundParentTask = tasks.find(
        ({ taskIdentifier: storeTaskId }) =>
          selectedTask.parentTaskIdentifier === storeTaskId,
      );
      const foundSubtaskOrder = foundParentTask?.subtasks.findIndex(
        ({ taskIdentifier: subtaskId }) => subtaskId === taskIdentifier,
      );

      return {
        task: selectedTaskWithAssignee,
        parentTask: foundParentTask,
        subtaskOrder: foundSubtaskOrder >= 0 ? foundSubtaskOrder + 1 : 0,
      };
    },
  );

  // #region CALLBACKS

  const dispatch = useDispatch();
  const taskIdentifier = task?.taskIdentifier;
  const taskWorkflowStatus = task?.workflowStatus;
  const taskPriority = task?.priority;
  const userIdentifier = userProfile?.userIdentifier;

  const storeAsCurrentTask = useCallback(
    newTask => storeAsCurrentTaskAction(newTask)(dispatch),
    [dispatch],
  );

  const saveTaskPriority = useCallback(
    ({ newTaskPriority }) => {
      toggleTaskPriority(
        task,
        parseInt(userIdentifier, 10) || -1,
        newTaskPriority,
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
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [taskIdentifier, userIdentifier],
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
  useMount(() => {
    getAllPatients()(dispatch);

    if (isMultiList && task?.taskList) {
      getMembersByTaskListId(task?.taskList?.taskListIdentifier, 'ALL')(
        dispatch,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

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
  }, [taskPriority, taskIdentifier]);

  useEffect(() => {
    const newWorkflowStatus =
      statusSelectData.find(({ value }) => value === taskWorkflowStatus) ??
      head(statusSelectData);

    setStatus(newWorkflowStatus);
  }, [taskWorkflowStatus, taskIdentifier, statusSelectData]);

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
  }, [taskIdentifier]);

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
    popoversOpen,
    priorityActive,
    saveTaskPriority,
    setAutoSaveTimeoutId,
    setAutoSaveVisible,
    setDeferredCommentsPromises,
    setHeadsUpAreaHeight,
    setPopoversOpen,
    setPriorityActive,
    setStatus,
    status,
    statusPopoverOpen,
    storeAsCurrentTask,
    subtaskOrder,
    task,
    taskIdentifier,
    taskContainerReference,
    togglePriorityActive,
    unsetAutoSaveVisible,
    unsetPriorityActive,
    userProfile,
  };
};
