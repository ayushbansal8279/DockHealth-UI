import {
  GET_COMPLETED_TASKS_BY_GROUPS_SUCCESS,
  GET_TASKS_BY_GROUPS_SUCCESS,
  REQUEST_COMPLETED_TASKS,
  REQUEST_TASKS,
  GET_MORE_TASKS_REQUEST,
  LIST_DETAILS_TASK_COUNTERS_SUCCESS,
  RESET_LIST_DETAILS_TASK_COUNTERS,
  UPDATE_TASK_SUCCESS,
  REQUEST_LOAD_SUBTASKS,
  LOAD_SUBTASKS_SUCCESS,
  REFRESH_ANOTHER_TASK_SUCCESS,
  INCREASE_INCOMPLETE_TASK_COUNTERS,
  INCREASE_COMPLETE_TASK_COUNTERS,
  REQUEST_TASKLIST_GROUP_TASKS_SUCCESS,
  REQUEST_TASKLIST_GROUP_TASKS,
  TASK_GROUP_LIST_REQUEST,
  TASK_GROUP_LIST_SUCCESS,
  TASK_GROUP_LIST_FAILURE,
  REQUEST_MULTIPLE_TASKLIST_GROUP_TASKS_SUCCESS,
  SET_LIST_DETAILS_TASKS_SORT,
  REQUEST_ALL_LIST_DETAILS_GROUPS,
} from 'actions/action-types';
import TaskBaseReducer from './task-base-reducer';

const initialState = {
  groupedTasks: {},
  completedGroupedTasks: {},
  newlyAddedTaskIds: [],
  isFetching: false,
  isCompletedTasksFetching: false,
  showingCompletedTasks: false,
  taskCountStats: null,
  isFetchingMoreTasks: false,
  taskCounters: {},
  listGroups: [],
  isFetchingGroups: false,
  listGroupsError: '',
  groupsInitialized: false,
  sort: {
    key: null,
    order: null,
  },
};

const updateTaskInGroupedTasks = (groupedTasks, task) =>
  groupedTasks?.taskGroups?.map(taskGroup => {
    return {
      ...taskGroup,
      tasks: taskGroup?.tasks?.map(t => {
        if (
          t.taskIdentifier !== task.parentTaskIdentifier &&
          t.taskIdentifier !== task.taskIdentifier
        ) {
          return t;
        }

        if (task.taskIdentifier === t.taskIdentifier) {
          return { ...t, ...task };
        }

        return {
          ...t,
          subtasks: t.subtasks.map(subtask =>
            subtask.taskIdentifier === task.taskIdentifier
              ? { ...subtask, ...task }
              : subtask,
          ),
          isFetchingSubTasks: false,
        };
      }),
    };
  });

const updateTaskInList = taskGroupIdentifier => (
  taskGroups,
  updateTaskCallback,
) =>
  taskGroups?.map(group => {
    if (!taskGroupIdentifier || taskGroupIdentifier === group.groupIdentifier) {
      return { ...group, tasks: updateTaskCallback(group.tasks || []) };
    }

    return group;
  });

const updateTasksStateCallback = taskGroupIdentifier => (
  state,
  updateTaskFromAction,
) => {
  return {
    ...state,
    groupedTasks: {
      ...state.groupedTasks,
      taskGroups: updateTaskInList(taskGroupIdentifier)(
        state.groupedTasks?.taskGroups,
        updateTaskFromAction,
      ),
    },
    completedGroupedTasks: {
      ...state.completedGroupedTasks,
      taskGroups: updateTaskInList(taskGroupIdentifier)(
        state.completedGroupedTasks?.taskGroups,
        updateTaskFromAction,
      ),
    },
  };
};

// eslint-disable-next-line sonarjs/cognitive-complexity
const ListDetailsReducer = (state = initialState, action) => {
  // eslint-disable-next-line sonarjs/max-switch-cases
  switch (action.type) {
    case TASK_GROUP_LIST_REQUEST:
      return {
        ...state,
        groupsInitialized: true,
      };

    case TASK_GROUP_LIST_SUCCESS:
      return {
        ...state,
        listGroups: action.listGroups,
        isFetchingGroups: false,
        groupsInitialized: true,
      };

    case TASK_GROUP_LIST_FAILURE:
      return {
        ...state,
        listGroupsError: 'Something went wrong',
        isFetchingGroups: false,
      };

    case GET_TASKS_BY_GROUPS_SUCCESS: {
      const { groupedTasks } = action;
      const updatedTaskGroups = groupedTasks?.taskGroups?.map(taskGroup => {
        return {
          ...taskGroup,
          isLoadingGroup: false,
        };
      });

      return {
        ...state,
        groupedTasks: {
          ...groupedTasks,
          taskGroups: updatedTaskGroups,
        },
        isFetching: false,
      };
    }

    case GET_COMPLETED_TASKS_BY_GROUPS_SUCCESS: {
      const { groupedTasks, loadingMore } = action;
      const group = groupedTasks.taskGroups[0];

      const groupToUpdate = state.completedGroupedTasks.taskGroups?.find(
        ({ groupIdentifier }) => groupIdentifier === group?.groupIdentifier,
      );
      const groupToUpdateIndex =
        state.completedGroupedTasks?.taskGroups?.indexOf(groupToUpdate) || -1;
      const updatedTaskGroups =
        state.completedGroupedTasks?.taskGroups?.map(taskGroup =>
          taskGroup.groupIdentifier === group?.groupIdentifier
            ? {
                ...taskGroup,
                tasks: loadingMore
                  ? taskGroup.tasks.concat(group.tasks)
                  : group.tasks,
                hasMore: group.hasMore,
              }
            : taskGroup,
        ) || [];
      if (groupToUpdateIndex === -1) {
        updatedTaskGroups.push(group);
      }
      const updatedGroupedTasks = {
        ...state.completedGroupedTasks,
        taskGroups: updatedTaskGroups,
      };

      return {
        ...state,
        completedGroupedTasks: updatedGroupedTasks,
        isCompletedTasksFetching: false,
        isFetchingMoreTasks: false,
        showingCompletedTasks: true,
        isFetching: false,
      };
    }

    case REQUEST_ALL_LIST_DETAILS_GROUPS: {
      return {
        ...state,
        groupedTasks: {
          ...state.groupedTasks,
          taskGroups: state.groupedTasks?.taskGroups?.map(taskGroup => ({
            ...taskGroup,
            isLoadingGroup: true,
          })),
        },
      };
    }

    case REQUEST_TASKLIST_GROUP_TASKS: {
      const { fetchedGroupIdentifier, refresh } = action;

      const groupToUpdate = state.groupedTasks?.taskGroups?.find(
        ({ groupIdentifier }) => groupIdentifier === fetchedGroupIdentifier,
      );
      const groupToUpdateIndex = state.groupedTasks?.taskGroups?.indexOf(
        groupToUpdate,
      );
      const updatedTaskGroups = state.groupedTasks?.taskGroups?.map(taskGroup =>
        taskGroup.groupIdentifier === fetchedGroupIdentifier
          ? {
              ...taskGroup,
              isLoadingGroup: !!refresh,
              isFetchingMoreTasks: !refresh,
            }
          : taskGroup,
      );
      if (groupToUpdateIndex === -1) {
        updatedTaskGroups.push({
          groupIdentifier: fetchedGroupIdentifier,
          tasks: [],
          hasMore: false,
          isLoadingGroup: true,
        });
      }

      return {
        ...state,
        groupedTasks: {
          ...state.groupedTasks,
          taskGroups: updatedTaskGroups,
        },
      };
    }

    case REQUEST_TASKLIST_GROUP_TASKS_SUCCESS: {
      const { groupOfTasks, refresh } = action;
      const group = groupOfTasks.taskGroups[0];

      const groupToUpdate = state.groupedTasks?.taskGroups?.find(
        ({ groupIdentifier }) => groupIdentifier === group?.groupIdentifier,
      );
      const groupToUpdateIndex = state.groupedTasks?.taskGroups?.indexOf(
        groupToUpdate,
      );
      const updatedTaskGroups = state.groupedTasks?.taskGroups?.map(taskGroup =>
        taskGroup.groupIdentifier === group?.groupIdentifier
          ? {
              ...taskGroup,
              tasks: refresh
                ? group.tasks
                : taskGroup.tasks.concat(group.tasks),
              hasMore: group.hasMore,
              isLoadingGroup: false,
              isFetchingMoreTasks: false,
            }
          : taskGroup,
      );
      if (groupToUpdateIndex === -1) {
        // new group
        group.isLoadingGroup = false;
        updatedTaskGroups.push(group);
      }

      return {
        ...state,
        groupedTasks: {
          ...state.groupedTasks,
          taskGroups: updatedTaskGroups,
        },
      };
    }

    case REQUEST_MULTIPLE_TASKLIST_GROUP_TASKS_SUCCESS: {
      const { groupsOfTasks, refresh } = action;

      const updatedTaskGroups = state.groupedTasks?.taskGroups?.map(
        taskGroup => {
          const taskGroupToUpdate = groupsOfTasks?.find(
            group =>
              taskGroup.groupIdentifier ===
              group?.taskGroups[0]?.groupIdentifier,
          );

          if (taskGroupToUpdate) {
            const group = taskGroupToUpdate.taskGroups[0];

            return {
              ...taskGroup,
              tasks: refresh
                ? group.tasks
                : taskGroup.tasks.concat(group.tasks),
              hasMore: group.hasMore,
              isLoadingGroup: false,
            };
          }

          return taskGroup;
        },
      );

      return {
        ...state,
        groupedTasks: {
          ...state.groupedTasks,
          taskGroups: updatedTaskGroups,
        },
      };
    }

    case REQUEST_TASKS:
      return {
        ...state,
        isFetching: true,
        tasks: [],
        completedTasks: [],
        showingCompletedTasks: false,
      };

    case REQUEST_COMPLETED_TASKS:
      return {
        ...state,
        completedTasks: [],
        isCompletedTasksFetching: true,
      };

    case RESET_LIST_DETAILS_TASK_COUNTERS:
      return {
        ...state,
        taskCounters: {},
      };

    case LIST_DETAILS_TASK_COUNTERS_SUCCESS:
      return {
        ...state,
        taskCounters: action.payload,
      };

    case INCREASE_INCOMPLETE_TASK_COUNTERS: {
      return {
        ...state,
        taskCounters: state.taskCounters
          ? {
              ...state.taskCounters,
              incomplete: state.taskCounters?.incomplete + 1,
            }
          : {},
      };
    }

    case INCREASE_COMPLETE_TASK_COUNTERS:
      return {
        ...state,
        taskCounters: state.taskCounters
          ? {
              ...state.taskCounters,
              complete: state.taskCounters.complete + 1,
            }
          : {},
      };

    case GET_MORE_TASKS_REQUEST: {
      return { ...state, isFetchingMoreTasks: true };
    }

    case REQUEST_LOAD_SUBTASKS: {
      const { task } = action;

      const groupedTasks =
        task.status === 'COMPLETE'
          ? state.completedGroupedTasks
          : state.groupedTasks;

      const updatedTaskGroups = groupedTasks?.taskGroups?.map(taskGroup => {
        return {
          ...taskGroup,
          tasks: taskGroup?.tasks?.map(t => {
            if (
              t.taskIdentifier !== task.parentTaskIdentifier &&
              t.taskIdentifier !== task.taskIdentifier
            ) {
              return t;
            }

            if (task.taskIdentifier === t.taskIdentifier) {
              return { ...t, ...task, isFetchingSubTasks: true };
            }

            return {
              ...t,
            };
          }),
        };
      });
      const updatedGroupedTasks = {
        ...groupedTasks,
        taskGroups: updatedTaskGroups,
      };

      if (task.status === 'COMPLETE') {
        return {
          ...state,
          completedGroupedTasks: updatedGroupedTasks,
        };
      }

      return {
        ...state,
        groupedTasks: updatedGroupedTasks,
      };
    }

    case UPDATE_TASK_SUCCESS:
    case LOAD_SUBTASKS_SUCCESS:
    case REFRESH_ANOTHER_TASK_SUCCESS: {
      let { task } = action;

      if (action.type === LOAD_SUBTASKS_SUCCESS) {
        task = { ...task, isFetchingSubTasks: false };
      }

      const updatedTaskGroups = updateTaskInGroupedTasks(state.groupedTasks, {
        ...task,
        isFetchingSubTasks: false,
      });

      const updatedCompletedTaskGroups = updateTaskInGroupedTasks(
        state.completedGroupedTasks,
        task,
      );

      return {
        ...state,
        groupedTasks: {
          ...state.groupedTasks,
          taskGroups: updatedTaskGroups,
        },
        completedGroupedTasks: {
          ...state.completedGroupedTasks,
          taskGroups: updatedCompletedTaskGroups,
        },
      };
    }

    case SET_LIST_DETAILS_TASKS_SORT: {
      const { key, order } = action.payload || {};

      return {
        ...state,
        sort: {
          key,
          order,
        },
      };
    }

    default:
      return TaskBaseReducer(
        state,
        action,
        updateTasksStateCallback(action.taskGroupIdentifier || null),
      );
  }
};

export default ListDetailsReducer;
