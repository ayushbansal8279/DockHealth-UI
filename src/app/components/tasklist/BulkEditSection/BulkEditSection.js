import React, {
  useEffect,
  useCallback,
  useState,
  useMemo,
  createContext,
} from 'react';
import { useSelector } from 'react-redux';
import BulkEditOptionsBar from './BulkEditOptionsBar/BulkEditOptionsBar';

export const BulkEditContext = createContext({});

const BulkEditSection = ({
  children,
  shouldResetBulkEditTasks,
  refreshTasksOnBulkAction,
  inactiveBulkEdit,
}) => {
  const [bulkEditTasks, setBulkEditTasks] = useState({
    parentTasks: [],
    subtasks: [],
  });

  const isTaskDrawerOpen = useSelector(store => store.taskDrawerState.open);

  const onSelectBulkEditParentTask = useCallback(
    ({ taskIdentifier, subTasksCount, hasAttachments }) =>
      setBulkEditTasks({
        ...bulkEditTasks,
        parentTasks: [
          ...bulkEditTasks.parentTasks,
          { taskIdentifier, subTasksCount, hasAttachments },
        ],
      }),
    [bulkEditTasks],
  );

  const onUnselectBulkEditParentTask = useCallback(
    ({ taskIdentifier }) =>
      setBulkEditTasks({
        ...bulkEditTasks,
        parentTasks: bulkEditTasks?.parentTasks?.filter(
          task => task.taskIdentifier !== taskIdentifier,
        ),
      }),
    [bulkEditTasks],
  );

  const getParentTaskIsSelectedInBulkEdit = useCallback(
    ({ taskIdentifier }) =>
      bulkEditTasks?.parentTasks?.find(
        task => task?.taskIdentifier === taskIdentifier,
      ),
    [bulkEditTasks],
  );

  const onClickBulkEditParentTask = useCallback(
    ({ taskIdentifier, subTasksCount, hasAttachments }) =>
      getParentTaskIsSelectedInBulkEdit({ taskIdentifier })
        ? onUnselectBulkEditParentTask({ taskIdentifier })
        : onSelectBulkEditParentTask({
            taskIdentifier,
            subTasksCount,
            hasAttachments,
          }),
    [
      getParentTaskIsSelectedInBulkEdit,
      onSelectBulkEditParentTask,
      onUnselectBulkEditParentTask,
    ],
  );

  const onSelectBulkEditSubtask = useCallback(
    ({ taskIdentifier, parentTaskIdentifier, hasAttachments }) =>
      setBulkEditTasks({
        ...bulkEditTasks,
        subtasks: [
          ...bulkEditTasks?.subtasks,
          { taskIdentifier, parentTaskIdentifier, hasAttachments },
        ],
      }),
    [bulkEditTasks],
  );

  const onUnselectBulkEditSubtask = useCallback(
    ({ taskIdentifier }) =>
      setBulkEditTasks({
        ...bulkEditTasks,
        subtasks: bulkEditTasks?.subtasks?.filter(
          task => task?.taskIdentifier !== taskIdentifier,
        ),
      }),

    [bulkEditTasks],
  );

  const getSubtaskIsSelectedInBulkEdit = useCallback(
    ({ taskIdentifier }) =>
      bulkEditTasks?.subtasks?.find(
        task => task.taskIdentifier === taskIdentifier,
      ),
    [bulkEditTasks],
  );

  const onClickBulkEditSubtask = useCallback(
    ({ taskIdentifier, parentTaskIdentifier, hasAttachments }) =>
      getSubtaskIsSelectedInBulkEdit({ taskIdentifier })
        ? onUnselectBulkEditSubtask({ taskIdentifier })
        : onSelectBulkEditSubtask({
            taskIdentifier,
            parentTaskIdentifier,
            hasAttachments,
          }),
    [
      getSubtaskIsSelectedInBulkEdit,
      onSelectBulkEditSubtask,
      onUnselectBulkEditSubtask,
    ],
  );

  const onClearBulkEditTasks = useCallback(
    () => setBulkEditTasks({ parentTasks: [], subtasks: [] }),
    [],
  );

  const bunchBulkEditTaskActions = useMemo(
    () => ({
      parentActions: {
        getTaskIsSelectedInBulkEdit: getParentTaskIsSelectedInBulkEdit,
        onClickBulkEditTask: onClickBulkEditParentTask,
        onUnselectBulkEditTask: onUnselectBulkEditParentTask,
      },
      subtaskActions: {
        getTaskIsSelectedInBulkEdit: getSubtaskIsSelectedInBulkEdit,
        onClickBulkEditTask: onClickBulkEditSubtask,
        onUnselectBulkEditTask: onUnselectBulkEditSubtask,
      },
    }),
    [
      getParentTaskIsSelectedInBulkEdit,
      onClickBulkEditParentTask,
      onUnselectBulkEditParentTask,
      getSubtaskIsSelectedInBulkEdit,
      onClickBulkEditSubtask,
      onUnselectBulkEditSubtask,
    ],
  );

  const bulkEditIsActive = useMemo(
    () =>
      bulkEditTasks?.parentTasks?.length !== 0 ||
      bulkEditTasks?.subtasks?.length !== 0,
    [bulkEditTasks],
  );

  useEffect(() => {
    if (
      shouldResetBulkEditTasks &&
      (bulkEditTasks?.parentTasks?.length !== 0 ||
        bulkEditTasks?.subtasks?.length !== 0)
    ) {
      onClearBulkEditTasks();
    }
  }, [shouldResetBulkEditTasks, bulkEditTasks, onClearBulkEditTasks]);

  if (inactiveBulkEdit) {
    return children;
  }

  return (
    <BulkEditContext.Provider
      value={{ bunchBulkEditTaskActions, bulkEditIsActive }}
    >
      {children}
      <BulkEditOptionsBar
        selectedTasks={bulkEditTasks}
        onClose={onClearBulkEditTasks}
        isDisabled={isTaskDrawerOpen}
        refreshTasksOnBulkAction={refreshTasksOnBulkAction}
      />
    </BulkEditContext.Provider>
  );
};

export default BulkEditSection;
