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
  refreshTasks,
  inactiveBulkEdit,
  searchValue,
  setShouldResetBulkEditTasks,
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
    ({
      taskIdentifier,
      subTasksCount,
      hasAttachments,
      taskList,
      assignedToUsers,
    }) =>
      setBulkEditTasks({
        ...bulkEditTasks,
        parentTasks: [
          ...bulkEditTasks.parentTasks,
          {
            taskIdentifier,
            subTasksCount,
            hasAttachments,
            taskList,
            assignedToUsers,
          },
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
    ({
      taskIdentifier,
      subTasksCount,
      hasAttachments,
      taskList,
      assignedToUsers,
    }) =>
      getParentTaskIsSelectedInBulkEdit({ taskIdentifier })
        ? onUnselectBulkEditParentTask({ taskIdentifier })
        : onSelectBulkEditParentTask({
            taskIdentifier,
            subTasksCount,
            hasAttachments,
            taskList,
            assignedToUsers,
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
    ({
      taskIdentifier,
      parentTaskIdentifier,
      hasAttachments,
      taskList,
      assignedToUsers,
    }) =>
      setBulkEditTasks({
        ...bulkEditTasks,
        subtasks: [
          ...bulkEditTasks?.subtasks,
          {
            taskIdentifier,
            parentTaskIdentifier,
            hasAttachments,
            taskList,
            assignedToUsers,
          },
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
    ({
      taskIdentifier,
      parentTaskIdentifier,
      hasAttachments,
      taskList,
      assignedToUsers,
    }) =>
      getSubtaskIsSelectedInBulkEdit({ taskIdentifier })
        ? onUnselectBulkEditSubtask({ taskIdentifier })
        : onSelectBulkEditSubtask({
            taskIdentifier,
            parentTaskIdentifier,
            hasAttachments,
            taskList,
            assignedToUsers,
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

  const onClearBulkEditTasks = useCallback(() => {
    setBulkEditTasks({ parentTasks: [], subtasks: [] });
    if (setShouldResetBulkEditTasks && shouldResetBulkEditTasks) {
      setShouldResetBulkEditTasks(false);
    }
  }, [setShouldResetBulkEditTasks, shouldResetBulkEditTasks]);

  const getGroupIsSelectedInBulkEdit = useCallback(
    (parentTasks, subtasks) =>
      parentTasks?.every(t => getParentTaskIsSelectedInBulkEdit(t)) &&
      subtasks?.every(t => getSubtaskIsSelectedInBulkEdit(t)),
    [getParentTaskIsSelectedInBulkEdit, getSubtaskIsSelectedInBulkEdit],
  );

  const onClickBulkEditGroup = useCallback(
    ({ parentTasks = [], subtasks = [] }) => {
      const groupIsSelected = getGroupIsSelectedInBulkEdit(
        parentTasks,
        subtasks,
      );

      if (groupIsSelected) {
        setBulkEditTasks({
          parentTasks: bulkEditTasks?.parentTasks?.filter(
            t =>
              !parentTasks.some(pT => pT.taskIdentifier === t.taskIdentifier),
          ),
          subtasks: bulkEditTasks?.subtasks?.filter(
            t => !subtasks.some(sT => sT.taskIdentifier === t.taskIdentifier),
          ),
        });
      } else {
        let parentTasksToPut = [];
        let subtasksToPut = [];

        if (parentTasks) {
          parentTasks.forEach(
            ({
              taskIdentifier,
              subTasksCount,
              attachments,
              taskList,
              assignedToUsers,
            }) => {
              const parentTaskIsSelected = getParentTaskIsSelectedInBulkEdit({
                taskIdentifier,
              });
              if (!parentTaskIsSelected) {
                parentTasksToPut = [
                  ...parentTasksToPut,
                  {
                    taskIdentifier,
                    subTasksCount,
                    hasAttachments: attachments?.length > 0,
                    taskList,
                    assignedToUsers,
                  },
                ];
              }
            },
          );
        }

        if (subtasks) {
          subtasks.forEach(
            ({
              taskIdentifier,
              parentTaskIdentifier,
              attachments,
              taskList,
              assignedToUsers,
            }) => {
              const subTaskIsSelected = getSubtaskIsSelectedInBulkEdit({
                taskIdentifier,
              });

              if (!subTaskIsSelected) {
                subtasksToPut = [
                  ...subtasksToPut,
                  {
                    taskIdentifier,
                    parentTaskIdentifier,
                    hasAttachments: attachments?.length > 0,
                    taskList,
                    assignedToUsers,
                  },
                ];
              }
            },
          );
        }

        setBulkEditTasks({
          parentTasks: [...bulkEditTasks?.parentTasks, ...parentTasksToPut],
          subtasks: [...bulkEditTasks?.subtasks, ...subtasksToPut],
        });
      }
    },
    [
      bulkEditTasks,
      getGroupIsSelectedInBulkEdit,
      getParentTaskIsSelectedInBulkEdit,
      getSubtaskIsSelectedInBulkEdit,
    ],
  );

  const bulkEditIsActive = useMemo(
    () =>
      bulkEditTasks?.parentTasks?.length !== 0 ||
      bulkEditTasks?.subtasks?.length !== 0,
    [bulkEditTasks],
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
      groupActions: {
        getGroupIsSelectedInBulkEdit,
        onClickBulkEditGroup,
      },
      bulkEditIsActive,
    }),
    [
      getParentTaskIsSelectedInBulkEdit,
      onClickBulkEditParentTask,
      onUnselectBulkEditParentTask,
      onUpdateSelectedBulkEditParentTask,
      getSubtaskIsSelectedInBulkEdit,
      onClickBulkEditSubtask,
      onUnselectBulkEditSubtask,
      onUpdateSelectedBulkEditSubtasks,
      getGroupIsSelectedInBulkEdit,
      onClickBulkEditGroup,
      bulkEditIsActive,
    ],
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
        refreshTasks={refreshTasks}
        currentUser={currentUser}
        searchValue={searchValue}
      />
    </BulkEditContext.Provider>
  );
};

export default BulkEditSection;
