import { useCallback, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as ListDetailsActions from 'actions/list-details-actions';
import {
  currentTaskListSelector,
  currentTaskListTasksStatusSelector,
} from 'selectors/task-list-selectors';
import {
  groupTasksSelector,
  listDetailsGroupsSelector,
} from 'selectors/list-details-selectors';
import { openModal, closeModal } from 'modal/actions';
import { deleteTask } from 'actions/task-actions';
import {
  reorderTaskListGroups,
  reorderTasksInGroup,
  reassignTasksToAnotherGroup,
  applyTaskTemplate,
} from 'actions/list-details-actions';
import { createTask } from 'sagas/list-details-saga';
import { getTemplates } from 'api/task-template-api';

import { BOARD_CONTEXTS } from './helpers';

// eslint-disable-next-line sonarjs/cognitive-complexity
const BoardContextProvider = ({ contextName, children }) => {
  const dispatch = useDispatch();
  const groupList = useSelector(listDetailsGroupsSelector);
  const taskList = useSelector(currentTaskListSelector);
  const groupTasks = useSelector(groupTasksSelector);
  const currentStatus = useSelector(currentTaskListTasksStatusSelector);

  const handleDeleteTask = useCallback(
    task => {
      const modalProps = {
        isSubtask: !!task.parentTaskIdentifier,
        confirm: () => {
          dispatch(deleteTask(task));
          dispatch(closeModal());
        },
      };
      dispatch(openModal('DeleteTaskConfirmation', modalProps));
    },
    [dispatch],
  );

  const handleDeleteColumn = useCallback(
    group => {
      const modalProps = {
        title: 'Delete user group',
        description:
          'Are you sure you want to delete this user group? This action cannot be undone.',
        confirm: () => {
          dispatch(ListDetailsActions.deleteTaskListGroup(group.identifier));
          dispatch(closeModal());
        },
      };
      dispatch(openModal('DeleteConfirmation', modalProps));
    },
    [dispatch],
  );

  useEffect(() => {
    if (
      contextName === BOARD_CONTEXTS.TASKS_GROUPS &&
      taskList &&
      (!groupList || groupList?.length === 0)
    ) {
      dispatch(ListDetailsActions.getTasksGroupsList());
    }
  }, [contextName, dispatch, groupList, taskList]);

  useEffect(() => {
    if (
      contextName === BOARD_CONTEXTS.TASKS_GROUPS &&
      taskList &&
      (!groupTasks || groupTasks?.length === 0)
    ) {
      groupList.forEach(({ taskGroupIdentifier }) => {
        dispatch(
          ListDetailsActions.getTasksForTaskGroups({
            taskGroupIdentifier,
            status: currentStatus,
            refresh: true,
          }),
        );
      });
    }
  }, [contextName, currentStatus, dispatch, groupList, groupTasks, taskList]);

  const getTaskContextMenuOptionsArray = useCallback(
    task => ({
      [BOARD_CONTEXTS.TASKS_GROUPS]: [
        { name: 'Delete', onClick: () => handleDeleteTask(task) },
      ],
    }),
    [handleDeleteTask],
  );
  const getColumnContextMenuOptionsArray = useCallback(
    column => ({
      [BOARD_CONTEXTS.TASKS_GROUPS]: [
        { name: 'Delete', onClick: () => handleDeleteColumn(column) },
      ],
    }),
    [handleDeleteColumn],
  );

  const context = useMemo(() => {
    // eslint-disable-next-line sonarjs/no-small-switch
    switch (contextName) {
      case BOARD_CONTEXTS.TASKS_GROUPS: {
        const handleReorderTasks = (source, destination) => {
          if (source?.droppableId === destination?.droppableId) {
            dispatch(reorderTasksInGroup({ destination, source }));
          } else {
            dispatch(reassignTasksToAnotherGroup({ destination, source }));
          }
        };

        const handleReorderColumns = (sourceIndex, destinationIndex) => {
          dispatch(reorderTaskListGroups(sourceIndex, destinationIndex));
        };

        const handleAddTask = ({ identifier }, description) => {
          const payload = {
            taskGroupIdentifier: identifier,
            description,
          };
          dispatch(createTask(payload));
        };

        const handleAddWorkflow = ({ identifier: taskGroupIdentifier }) => {
          dispatch(
            openModal('SmartFlowList', {
              fetchMethod: () => getTemplates(),
              closeModal,
              confirmText: 'Select',
              setWorkflow: ({ identifier: taskTemplateIdentifier }) => {
                dispatch(
                  applyTaskTemplate({
                    taskTemplateIdentifier,
                    taskListIdentifier: taskList?.taskListIdentifier,
                    taskGroupIdentifier,
                  }),
                );
              },
            }),
          );
        };

        const columns = groupList?.map(g => {
          const foundGroup = groupTasks?.find(
            gt => gt.groupIdentifier === g.taskGroupIdentifier,
          );
          return {
            identifier: g.taskGroupIdentifier,
            name: g.groupName,
            tasks: foundGroup?.tasks,
          };
        });

        return {
          columns,
          handleReorderTasks,
          handleReorderColumns,
          handleAddTask,
          handleAddWorkflow,
          getTaskContextMenuOptionsArray: task =>
            getTaskContextMenuOptionsArray(task)?.[contextName],
          getColumnContextMenuOptionsArray: task =>
            getColumnContextMenuOptionsArray(task)?.[contextName],
        };
      }

      default:
        return null;
    }
  }, [
    contextName,
    dispatch,
    getColumnContextMenuOptionsArray,
    getTaskContextMenuOptionsArray,
    groupList,
    groupTasks,
    taskList,
  ]);

  return typeof children === 'function' ? children(context) : children;
};

export default BoardContextProvider;
