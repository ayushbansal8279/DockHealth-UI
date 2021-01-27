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
  searchValue,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const [bulkEditTasks, setBulkEditTasks] = useState({
    parentTasks: [],
    subtasks: [],
  });

  const { isTaskDrawerOpen, currentUser } = useSelector(store => ({
    isTaskDrawerOpen: store.taskDrawerState.open,
    currentUser: store.userState.userProfile,
  }));

  const onSelectBulkEditParentTask = useCallback(
    ({ taskIdentifier, subTasksCount, hasAttachments, taskList }) =>
      setBulkEditTasks({
        ...bulkEditTasks,
        parentTasks: [
          ...bulkEditTasks.parentTasks,
          { taskIdentifier, subTasksCount, hasAttachments, taskList },
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
    ({ taskIdentifier, subTasksCount, hasAttachments, taskList }) =>
      getParentTaskIsSelectedInBulkEdit({ taskIdentifier })
        ? onUnselectBulkEditParentTask({ taskIdentifier })
        : onSelectBulkEditParentTask({
            taskIdentifier,
            subTasksCount,
            hasAttachments,
            taskList,
          }),
    [
      getParentTaskIsSelectedInBulkEdit,
      onSelectBulkEditParentTask,
      onUnselectBulkEditParentTask,
    ],
  );

  const onUpdateSelectedBulkEditParentTask = useCallback(
    ({ taskIdentifier, ...changes }) => {
      setBulkEditTasks({
        ...bulkEditTasks,
        parentTasks: bulkEditTasks?.parentTasks?.map(parentTask =>
          parentTask?.taskIdentifier === taskIdentifier
            ? { ...parentTask, ...changes }
            : parentTask,
        ),
      });
    },
    [bulkEditTasks],
  );

  const onSelectBulkEditSubtask = useCallback(
    ({ taskIdentifier, parentTaskIdentifier, hasAttachments, taskList }) =>
      setBulkEditTasks({
        ...bulkEditTasks,
        subtasks: [
          ...bulkEditTasks?.subtasks,
          { taskIdentifier, parentTaskIdentifier, hasAttachments, taskList },
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
    ({ taskIdentifier, parentTaskIdentifier, hasAttachments, taskList }) =>
      getSubtaskIsSelectedInBulkEdit({ taskIdentifier })
        ? onUnselectBulkEditSubtask({ taskIdentifier })
        : onSelectBulkEditSubtask({
            taskIdentifier,
            parentTaskIdentifier,
            hasAttachments,
            taskList,
          }),
    [
      getSubtaskIsSelectedInBulkEdit,
      onSelectBulkEditSubtask,
      onUnselectBulkEditSubtask,
    ],
  );

  const onUpdateSelectedBulkEditSubtasks = useCallback(
    ({ taskIdentifier, ...changes }) => {
      setBulkEditTasks({
        ...bulkEditTasks,
        subtasks: bulkEditTasks?.subtasks?.map(subtask =>
          subtask?.taskIdentifier === taskIdentifier
            ? { ...subtask, ...changes }
            : subtask,
        ),
      });
    },
    [bulkEditTasks],
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
        onUpdateSelectedBulkEditTask: onUpdateSelectedBulkEditParentTask,
      },
      subtaskActions: {
        getTaskIsSelectedInBulkEdit: getSubtaskIsSelectedInBulkEdit,
        onClickBulkEditTask: onClickBulkEditSubtask,
        onUnselectBulkEditTask: onUnselectBulkEditSubtask,
        onUpdateSelectedBulkEditTask: onUpdateSelectedBulkEditSubtasks,
      },
    }),
    [
      getParentTaskIsSelectedInBulkEdit,
      onClickBulkEditParentTask,
      onUnselectBulkEditParentTask,
      getSubtaskIsSelectedInBulkEdit,
      onClickBulkEditSubtask,
      onUnselectBulkEditSubtask,
      onUpdateSelectedBulkEditSubtasks,
      onUpdateSelectedBulkEditParentTask,
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
        currentUser={currentUser}
        searchValue={searchValue}
      />
    </BulkEditContext.Provider>
  );
};

export default BulkEditSection;
